// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHandler, HandlerCollection, ajv } from '../../lib/utils/apiRequests';
// import { signupUser } from '../../services/auth/session';
import { createAjvJTDSchema } from 'combined-validator';
// import { getSession, setSession } from '../../services/auth/auth-cookie';
import { users } from '../../config/shared/publicFieldConstants';

export * from "../../lib/defaultEndpointConfig"

type Data = {
  name: string
}

const handlers: HandlerCollection = {
  POST: async function (req, res) {

    // const signupResult = await signupUser(req.body);

    // if (!signupResult) return res.status(400).send("This did not seem to work. Can you please double-check that this email is not used?")

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
      POST: ajv.compileParser(createAjvJTDSchema(users))
    })(req, res)
}
