import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import { genRandomToken, sanitiseForMongo } from "./security";
import { FieldConstraintsCollection, extract, flatten, createAjvJTDSchema } from "combined-validator"
import { fixedTimeComparison } from "@hapi/cryptiles"

import Ajv, { JTDParser } from "ajv/dist/jtd"
import { getMongo } from "../../services/mongo";
import { getSession, updateSession } from "../../services/auth/auth-cookie";
import { csrfHeaderName, currentPageHeaderName } from "../../config/shared/config"
export const ajv = new Ajv({
    strictRequired: true,
    allErrors: true,
    removeAdditional: "all"
});

type SupportedMethods = "GET" | "POST";

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
export type HandlerCollection = {
    [key in SupportedMethods]?: Handler;
};

export type AjvParserCollection = {
    [key in SupportedMethods]?: JTDParser<any>;
};

export type QueryFieldsCollection = {
    [key in SupportedMethods]?: FieldConstraintsCollection
}

export type ExtendedNextApiRequest = NextApiRequest & {
    originalUrl?: string,
    session?: any
}

export type ExtendedNextApiResponse = NextApiResponse & {

}

export function createHandler(handlers: HandlerCollection, options: { useCsrf: boolean }, bodyParsers?: AjvParserCollection, queryRequiredFields?: QueryFieldsCollection) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        function isSupportedType(method: string): method is SupportedMethods {
            return handlers.hasOwnProperty(method);
        }
        const method = req.method
        if (method === undefined || !isSupportedType(method)) {
            res.setHeader("Allow", Object.keys(handlers));
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

        // expect to use csrf at least with post
        if (method === "POST" && !options.useCsrf) throw new Error("Make sure to use csrf tokens with post")

        try {
            extendReqRes(req, res);

            const bodyParser = (bodyParsers as any)?.[method] as JTDParser<any> | undefined;
            const queryFieldRules = (queryRequiredFields as any)?.[method] as FieldConstraintsCollection | undefined;
            await sanitise(req, res, bodyParser, queryFieldRules);
            // if sanitising already sent a response
            if (res.headersSent) return;

            if (options.useCsrf) checkCsrf(req, res);
            if (res.headersSent) return;

            await getMongo(); // connect if not connected

            await handlers[method]?.(req, res);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Could not process that request. Please contact us at hello@cybervolunteers.org.uk")
        }
    }
}

async function checkCsrf(req: NextApiRequest, res: NextApiResponse) {
    const receivedPageName = req.headers[currentPageHeaderName.toLowerCase()];
    if (typeof receivedPageName !== "string") return res.status(400).send("Incorrect or undefined current page header");

    const expectedCsrfToken = (await getSession(req))?.csrfToken?.[receivedPageName]; // from the sealed csrf cookie
    const receivedCsrfToken = req.headers[csrfHeaderName.toLowerCase()]; // from the headers


    if (typeof receivedCsrfToken !== "string") return res.status(400).send("Incorrect or undefined csrf header");

    if (!fixedTimeComparison(expectedCsrfToken, receivedCsrfToken)) return res.status(403).send("Invalid csrf token");
}

async function sanitise(req: NextApiRequest, res: NextApiResponse, bodyParser: JTDParser<any> | undefined, queryFieldRules: FieldConstraintsCollection | undefined) {
    // protect against prototype pollution - force a more strict parser
    if (req.body !== undefined) throw new Error(`You did not disable the body-parser. For extra security, please do so by including 'export * from "../../lib/defaultEndpointConfig"' in your endpoint`)

    req.body = await (await getRawBody(req)).toString()
    req.body = bodyParser ? bodyParser(req.body) : null;

    // if failed, show it
    if (req.body === undefined) return res.status(400).send("The shape of the json data supplied to this endpoint is incorrect");

    if (queryFieldRules) {
        try {
            req.query = extract(req.query, flatten(queryFieldRules));
        } catch (e) {
            return res.status(400).send("The shape of the query data supplied to this endpoint is incorrect. Did you mistype the url?");
        }
    } else req.query = null as any; // disable query

    // technically not needed, but here just in case someone allows all keys
    req.body = sanitiseForMongo(req.body)

    req.query = sanitiseForMongo(req.query)
}

function extendReqRes(req: NextApiRequest, res: NextApiResponse) {
    const newReq: ExtendedNextApiRequest = req;
    const newRes: ExtendedNextApiResponse = res;
    newReq.originalUrl = req.url;
}
