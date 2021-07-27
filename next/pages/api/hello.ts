// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHandler, HandlerCollection, ajv } from '../../lib/utils/apiRequests';
import { login } from '../../services/auth/session';
import loginSpec from "../../services/config/shared/endpointSpec/login"
import { createAjvJTDSchema } from 'combined-validator';

export * from "../../lib/defaultEndpointConfig"

type Data = {
  name: string
}

const handlers: HandlerCollection = {
  POST: async function (req, res) {

    const loginResult = await login(req.body.email, req.body.password);
    console.log(loginResult)

    res.status(200).json({ name: 'John Doe' })
  }
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await createHandler(handlers, {
    POST: ajv.compileParser(createAjvJTDSchema(loginSpec))
  }, {
    POST: {
      required: {
        string: {
          stuff: {}
        }
      }
    }
  })(req, res)
}
