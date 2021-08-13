import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import { sanitiseForMongo } from "./security";
import { FieldConstraintsCollection, extract, flatten } from "combined-validator";

import Ajv, { JTDParser } from "ajv/dist/jtd";
import { getMongo } from "./mongo";
import { checkCsrf } from "../serverAndClient/csrf";
import { HandlerCollection, AjvParserCollection, QueryFieldsCollection, ExtendedNextApiRequest, ExtendedNextApiResponse, SupportedMethods } from "./types";
import { contactEmail } from "../serverAndClient/staticDetails";
export const ajv = new Ajv({
	strictRequired: true,
	allErrors: true,
	removeAdditional: "all"
});

type HandlerOptions = { useCsrf: boolean, allowFiles?: boolean };
export function createHandler(handlers: HandlerCollection, options: HandlerOptions, bodyParsers?: AjvParserCollection, queryRequiredFields?: QueryFieldsCollection) {
	return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
		function isSupportedType(method: string): method is SupportedMethods {
			return method in handlers;
		}
		const method = req.method;
		if (method === undefined || !isSupportedType(method)) {
			res.setHeader("Allow", Object.keys(handlers));
			return res.status(405).end(`Method ${req.method} Not Allowed`);
		}

		// expect to use csrf at least with post
		if (method === "POST" && !options.useCsrf) throw new Error("Make sure to use csrf tokens with post");

		try {
			extendReqRes(req, res);

			const bodyParser = (bodyParsers as { [key: string]: JTDParser | undefined })?.[method];
			const queryFieldRules = (queryRequiredFields as { [key: string]: FieldConstraintsCollection | undefined })?.[method];
			await sanitise(req, res, bodyParser, queryFieldRules, options);
			// if sanitising already sent a response
			if (res.headersSent) return;

			if (options.useCsrf) await checkCsrf(req, res);
			if (res.headersSent) return;

			// There is no better way. Just try to add this if mongo might be needed
			await getMongo(); // connect if not connected

			await handlers[method]?.(req, res);
		} catch (err) {
			console.error(err);
			return res.status(500).send(`Could not process that request. Please contact us at ${contactEmail}`);
		}
	};
}

async function sanitise(req: NextApiRequest, res: NextApiResponse, bodyParser: JTDParser | undefined, queryFieldRules: FieldConstraintsCollection | undefined, options: HandlerOptions) {
	// protect against prototype pollution - force a more strict parser
	if (req.body !== undefined) throw new Error("You did not disable the body-parser. For extra security, please do so by including 'export * from \"../../lib/defaultEndpointConfig\"' in your endpoint");


	// if not a formidable form, do processing, else leave it up to multer
	if (options.allowFiles !== true) {
		// read from the stream
		req.body = await (await getRawBody(req)).toString();
		if (verifyJSONShape(req, res, bodyParser) === false) return;
	}



	if (queryFieldRules) {
		try {
			req.query = extract(req.query, flatten(queryFieldRules));
		} catch (e) {
			return res.status(400).send("The shape of the query data supplied to this endpoint is incorrect. Did you mistype the url?");
		}
		//@ts-ignore
	} else req.query = null; // disable queries

	// technically not needed, but here just in case someone allows all keys
	req.body = sanitiseForMongo(req.body);

	req.query = sanitiseForMongo(req.query);
}

function extendReqRes(req: NextApiRequest, res: NextApiResponse) {
	const convertedReq: ExtendedNextApiRequest = req;
	const convertedRes: ExtendedNextApiResponse = res;
	convertedReq.originalUrl = req.url;
}

export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, next: (passedVal: any) => void) => void) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result)
			}

			return resolve(result)
		})
	})
}

export function verifyJSONShape(req: NextApiRequest, res: NextApiResponse, bodyParser: JTDParser | undefined) {
	/* Thanks to FormData, the data might come in the form of 
		{
			 string: '"0"',
			 object: '{"under16":false,"between16And18":true,"between18And55":false,"over55":false}',
			 boolean: 'false',
			 number: '0',
		   }
		   we need to remove the quotes to have usable data
		*/
		if (typeof req.body === "object" && req.body !== null) {
		const isSuccess = Object.entries(req.body).every(([k, v]) => {
			try{
				req.body[k] = JSON.parse(v as any);
				return true;
			}catch{
				return false;
			}
		})
		if (!isSuccess) {
			//TODO: add logging
			console.log("req.body is an object and not all of its keys are valid json")
			req.body = undefined;
		} else req.body = JSON.stringify(req.body) // convert to a JSON string
	}
	// parse
	if(req.body !== undefined) req.body = bodyParser? bodyParser(req.body) : null;

	// if failed, show it
	if (req.body === undefined) {
		res.status(400).send("The shape of the json data supplied to this endpoint is incorrect");
		return false;
	}
	return req.body;
}