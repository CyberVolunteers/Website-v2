// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHandler, HandlerCollection } from '../../lib/utils/apiRequests';
import { login } from '../../services/auth/session';
// import * as getRawBody from 'raw-body';

type Data = {
  name: string
}

// export * from "../../lib/defaultEndpointConfig"

const handlers: HandlerCollection = {
  POST: async function (req, res) {
    // console.log(await getRawBody(req))
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

    await login(req.body.email, "passwd");

    res.status(200).json({ name: 'John Doe' })
  }
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await createHandler(handlers)(req, res)
}
