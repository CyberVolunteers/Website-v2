// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getMongo } from "../../services/mongo/mongo"
import { Listing } from "../../services/mongo/mongoModels"

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const mongo = await getMongo();

  new Listing({
  }).validate().catch(console.error)

  res.status(200).json({ name: 'John Doe' })
}
