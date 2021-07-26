import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import { sanitiseForMongo } from "./security";

import Ajv, { JTDParser } from "ajv/dist/jtd"
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

type ExtendedNextApiRequest = NextApiRequest & {
    originalUrl?: string
}

type ExtendedNextApiResponse = NextApiResponse & {

}

export function createHandler(handlers: HandlerCollection, parsers: AjvParserCollection) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        function isSupportedType(method: string): method is SupportedMethods {
            return handlers.hasOwnProperty(method);
        }
        const method = req.method
        if (method === undefined || !isSupportedType(method)) {
            res.setHeader("Allow", Object.keys(handlers));
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

        try {
            extendReqRes(req, res);

            const parser = (parsers as any)[method] as JTDParser<any> | undefined;
            await sanitise(req, res, parser);

            // if sanitising rejected the headers
            if (res.headersSent) return;

            await handlers[method]?.(req, res);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Could not process that request. Please contact us at hello@cybervolunteers.org.uk")
        }
    }
}


async function sanitise(req: NextApiRequest, res: NextApiResponse, parser: JTDParser<any> | undefined) {
    // protect against prototype pollution
    if (req.body !== undefined) throw new Error(`You did not disable the body-parser. For extra security, please do so by including 'export * from "../../lib/defaultEndpointConfig"' in your endpoint`)

    req.body = await (await getRawBody(req)).toString()
    if (!parser) throw Error("No parser has been supplied.");
    const parsed = parser(req.body);

    // if failed, show it
    if (parsed === undefined) return res.status(400).send("The json schema supplied to this endpoint is incorrect");

    req.body = parsed
    console.log(parsed)
    // todo: do the same for the query

    // technically not needed, but here jusst in case someone allows all keys
    req.query = sanitiseForMongo(req.query)
    req.body = sanitiseForMongo(req.body)
}

function extendReqRes(req: NextApiRequest, res: NextApiResponse) {
    const newReq: ExtendedNextApiRequest = req;
    const newRes: ExtendedNextApiResponse = res;
    newReq.originalUrl = req.url;
}
