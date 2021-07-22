import { NextApiRequest, NextApiResponse } from "next";
import { deleteProto, sanitiseForMongo } from "./security";

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
    // await runMiddleware(req, res, filter({
    //     urlMessage: "This request did not pass our requirements. Please enter different data",
    //     bodyMessage: "This request did not pass our requirements. Please enter different data"
    // }))
    req.query = sanitiseForMongo(deleteProto(req.query))
    req.body = sanitiseForMongo(deleteProto(req.body))
}

function extendReqRes(req: NextApiRequest, res: NextApiResponse) {
    const newReq: ExtendedNextApiRequest = req;
    const newRes: ExtendedNextApiResponse = res;
    newReq.originalUrl = req.url;
}


// modified code, original: https://nextjs.org/docs/api-routes/api-middlewares
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
// function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, next: (error?: any) => void) => void) {
//     return new Promise((resolve, reject) => {
//         fn(req, res, (result) => {
//             if (result !== undefined) {
//                 return resolve(result)
//             }

//             return reject(result)
//         })
//     })
// }