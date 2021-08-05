// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHandler } from '../../lib/utils/apiRequests';
import { isEmailFree } from '../../server/auth/session';
import { createAjvJTDSchema } from 'combined-validator';
import { HandlerCollection } from '../../server/types';

export * from "../../lib/defaultEndpointConfig"

type Data = {
  name: string
}

const handlers: HandlerCollection = {
  GET: async function (req, res) {
    const email = req.query.email;

    if (Array.isArray(email)) return res.status(400).send("Invalid arguments");

    return res.json(await isEmailFree(email))
  }
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await createHandler(handlers,
    {
      useCsrf: false,
    },
    undefined,
    {
      GET: {
        required: {
          string: {
            email: {}
          }
        }
      }
    })(req, res)
}
