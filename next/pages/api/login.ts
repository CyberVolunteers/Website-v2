// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHandler, HandlerCollection, ajv } from '../../lib/utils/apiRequests';
import { login } from '../../services/auth/session';
import loginSpec from "../../config/shared/endpointSpec/login"
import { createAjvJTDSchema } from 'combined-validator';
import { getSession, updateSession } from '../../services/auth/auth-cookie';

export * from "../../lib/defaultEndpointConfig"

type Data = {
  name: string
}

const handlers: HandlerCollection = {
  POST: async function (req, res) {

    const session = await getSession(req)

    if (session?.email) return res.send("Already signed in");

    const loginResult = await login(req.body);

    if (!loginResult) return res.status(400).send("This email and password combination does not appear to be correct")

    await updateSession(req, res, loginResult) //TODO: add some data here

    return res.end()
  }
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await createHandler(handlers,
    {
      useCsrf: true,
    },
    {
      POST: ajv.compileParser(createAjvJTDSchema(loginSpec))
    })(req, res)
}
