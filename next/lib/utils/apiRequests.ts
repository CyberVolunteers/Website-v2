import { NextApiRequest, NextApiResponse } from "next";
import { deleteProto } from "./security";

type SupportedMethods = "GET" | "POST";

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
export type HandlerCollection = {
    [key in SupportedMethods]?: Handler;
};


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
            // protect against prototype pollution
            req.query = deleteProto(req.query)
            req.body = deleteProto(req.body)

            await handlers[method]?.(req, res);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Could not process that request. Please contact us at hello@cybervolunteers.org.uk")
        }
    }
}