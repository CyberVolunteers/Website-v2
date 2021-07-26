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
    const parser = ajv.compileParser({})
    // new Listing({

    // }).validate().catch(console.error)

    // console.log(await User.find({}));
    // console.log(await Org.find({}));
    // console.log(await Listing.find({}));
    // await User.create({
    //   firstName: "J",
    //   lastName: "D",
    //   passwordHash: await hash("password"),
    //   email: "email@email.com",
    //   gender: "M",
    //   city: "Moscow Moscow ta da da ta da ta da",
    //   country: "Germany",
    //   skillsAndInterests: "none",
    //   birthDate: new Date()
    // })

    // console.log(req)

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
  })(req, res)
}
