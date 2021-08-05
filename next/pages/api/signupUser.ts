// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHandler, ajv } from '../../lib/utils/apiRequests';
import { signupUser } from '../../server/auth/session';
import { createAjvJTDSchema } from 'combined-validator';
import { users } from '../../serverAndClient/publicFieldConstants';
import { HandlerCollection } from '../../server/types';

export * from "../../lib/defaultEndpointConfig"

type Data = {
  name: string
}

const handlers: HandlerCollection = {
  POST: async function (req, res) {

    const signupResult = await signupUser(req.body);

    if (!signupResult) return res.status(400).send("This did not seem to work. Can you please double-check that this email is not used?")

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
