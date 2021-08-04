// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHandler, HandlerCollection } from '../../lib/utils/apiRequests';

export * from "../../lib/defaultEndpointConfig"

type Data = {
    name: string
}

const handlers: HandlerCollection = {
    GET: async function (req, res) {
        return res.json({})
    }
}

export default async function (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await createHandler(
        handlers,
        {
            useCsrf: true,
        })(req, res)
}
