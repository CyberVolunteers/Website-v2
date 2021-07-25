import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import { sanitiseForMongo } from "./security";

type SupportedMethods = "GET" | "POST";

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
export type HandlerCollection = {
    [key in SupportedMethods]?: Handler;
};

type ExtendedNextApiRequest = NextApiRequest & {
    originalUrl?: string
}

type ExtendedNextApiResponse = NextApiResponse & {

}

export function createHandler(handlers: HandlerCollection) {
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
            await sanitise(req, res);

            await handlers[method]?.(req, res);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Could not process that request. Please contact us at hello@cybervolunteers.org.uk")
        }
    }
}


async function sanitise(req: NextApiRequest, res: NextApiResponse) {
    // protect against prototype pollution
    if (req.body !== undefined) throw new Error(`You did not disable the body-parser. For extra security, please do so by including 'export * from "../../lib/defaultEndpointConfig"' in your endpoint`)

    req.body = await (await getRawBody(req)).toString()

    // todo: do the same for the query

    req.query = sanitiseForMongo(req.query)
    req.body = sanitiseForMongo(req.body)
}

function extendReqRes(req: NextApiRequest, res: NextApiResponse) {
    const newReq: ExtendedNextApiRequest = req;
    const newRes: ExtendedNextApiResponse = res;
    newReq.originalUrl = req.url;
}
