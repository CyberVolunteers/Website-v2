import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import {
	FieldConstraintsCollection,
	extract,
	flatten,
} from "combined-validator";

import Ajv, { JTDParser } from "ajv/dist/jtd";
import { getMongo } from "./mongo";
import { enforceValidCsrf } from "./csrf";
import {
	HandlerCollection,
	AjvParserCollection,
	QueryFieldsCollection,
	ExtendedNextApiRequest,
	ExtendedNextApiResponse,
	SupportedMethods,
} from "./types";
import { contactEmail } from "../serverAndClient/staticDetails";
import { logger } from "./logger";
import getConfig from "next/config";

export const ajv = new Ajv({
	strictRequired: true,
	allErrors: true,
	removeAdditional: "all",
});

const { publicRuntimeConfig } = getConfig();

type HandlerOptions = { useCsrf: boolean; allowFiles?: boolean };

/** a helper function to create api endpoints
 * @param handlers An object of functions to call for different request methods
 * @param options Additional options to change how the request is processed
 * @param bodyParsers An object of ajv parsers by request method
 * @param queryRequiredFields The fields that are expected to be within the query portion of the request
 * @returns a handler nextjs expects
 */
export function createHandler(
	handlers: HandlerCollection,
	options: HandlerOptions,
	bodyParsers?: AjvParserCollection,
	queryRequiredFields?: QueryFieldsCollection
) {
	return async (
		req: ExtendedNextApiRequest,
		res: ExtendedNextApiResponse
	): Promise<void> => {
		logger.info("server.apiRequests:Request to url %s", req.url);
		function isSupportedType(method: string): method is SupportedMethods {
			return method in handlers;
		}
		const method = req.method;
		if (method === undefined || !isSupportedType(method)) {
			logger.info("server.apiRequests:Bad request method %s", req.method);
			res.setHeader("Allow", Object.keys(handlers));
			return res.status(405).end(`Method ${req.method} Not Allowed`);
		}

		// expect to use csrf at least with post
		if (method === "POST" && !options.useCsrf && publicRuntimeConfig.IS_DEV)
			logger.warn("Make sure to use csrf tokens with post");

		try {
			// preserve the original url (needed for some middleware that was designed for expressjs)
			// create a copy
			req.originalUrl = "" + req.url;

			const bodyParser = (
				bodyParsers as { [key: string]: JTDParser | undefined }
			)?.[method];
			const queryFieldRules = (
				(queryRequiredFields ?? {}) as {
					[key: string]: FieldConstraintsCollection | undefined;
				}
			)[method];
			await sanitize(req, res, bodyParser, queryFieldRules, options);
			// if sanitizing already sent a response
			if (res.headersSent) return;

			if (options.useCsrf) await enforceValidCsrf(req, res);
			if (res.headersSent) return;

			// There is no better way. Just try to add this if mongo might be needed
			await getMongo(); // connect if not connected

			await handlers[method]?.(req, res);
		} catch (err) {
			logger.error("server.apiRequests.error:", err);
			return res
				.status(500)
				.send(
					`Could not process that request. Please contact us at ${contactEmail}`
				);
		}
	};
}

/**
 * Sanitizes user input. Note: it might send a response, so check for res.headersSent afterwards
 * @param req request to modify
 * @param res response to use if something is incorrect
 * @param bodyParser ajv parser to use
 * @param queryFieldRules query fields to expect
 * @param options additional options for determining how the data should be handled
 * @returns boolean indicating if the data was correct
 */
async function sanitize(
	req: NextApiRequest,
	res: NextApiResponse,
	bodyParser: JTDParser | undefined,
	queryFieldRules: FieldConstraintsCollection | undefined,
	options: HandlerOptions
) {
	// protect against prototype pollution - force a more strict parser
	if (req.body !== undefined)
		throw new Error(
			"You did not disable the body-parser. For extra security, please do so by including 'export * from \"../../lib/defaultEndpointConfig\"' in your endpoint"
		);

	// if not a formidable form, do processing, else leave it up to multer
	if (options.allowFiles !== true && req.method !== "GET") {
		logger.info(
			"server.apiRequests:Checking JSON format (not GET and no file expected)"
		);
		// read from the stream
		req.body = await (await getRawBody(req)).toString();
		if (verifyJSONShape(req, res, bodyParser) === false) return false;
	}

	if (queryFieldRules) {
		try {
			req.query = extract(req.query, flatten(queryFieldRules));
		} catch (e) {
			logger.info("server.apiRequests:Bad query shape");
			res
				.status(400)
				.send(
					`The data we received was not correct. Please email us at ${contactEmail} if you believe this is an error`
				);
			return false;
		}
		//@ts-ignore
	} else req.query = null; // disable queries
	return true;
}

/**
 * A wrapper around express middleware so that it can be used with async-await
 * @param req 
 * @param res
 * @param middleware the actual middleware
 * @returns
 */
export function runMiddleware(
	req: ExtendedNextApiResponse,
	res: ExtendedNextApiResponse,
	middleware: (
		req: ExtendedNextApiResponse,
		res: ExtendedNextApiResponse,
		next: (passedVal: any) => void
	) => void
) {
	return new Promise((resolve, reject) => {
		middleware(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}

/**
 * Uses ajv to parse json and put it into req.body
 * Note: might send a response, so check res.headersSent
 * @param req request
 * @param res response to
 * @param bodyParser the ajv parser to use. Can be set to undefined to disable parsing.
 * @returns parsed json or null if there is no parser or false if the json is not correct
 */
export function verifyJSONShape(
	req: NextApiRequest,
	res: NextApiResponse,
	bodyParser: JTDParser | undefined
) {
	/* Thanks to FormData, the data might come in the form of 
		{
			 string: '"0"',
			 object: '{"under16":false,"between16And18":true,"between18And55":false,"over55":false}',
			 boolean: 'false',
			 number: '0',
		   }
		   we need to remove the quotes to have usable data
		*/
	if (!bodyParser) {
		// sets the req body to null if parsing it was disabled
		req.body = null;
		return req.body;
	}
	if (!!bodyParser && typeof req.body === "object" && req.body !== null) {
		const isSuccess = Object.entries(req.body).every(([k, v]) => {
			try {
				req.body[k] = JSON.parse(v as any);
				return true;
			} catch {
				return false;
			}
		});
		if (!isSuccess) {
			logger.info(
				"server.apiRequests:req.body is an object and not all of its keys are valid json"
			);
			// dispose of the tampered json
			req.body = undefined;
		} else req.body = JSON.stringify(req.body); // convert to a JSON string
	}
	// parse
	if (req.body !== undefined)
		// sets the new json OR sets the req body to null if parsing it was disabled
		req.body = bodyParser(req.body);

	// if failed, show it
	if (req.body === undefined) {
		logger.error("server.apiRequests:bad JSON shape");
		res
			.status(400)
			.send(
				`The data we received was not correct. Please email us at ${contactEmail} if you believe this is an error`
			);
		return false;
	}
	return req.body;
}
