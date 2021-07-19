// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getMongo } from "../../services/mongo/mongo"
import { User, Org, Listing } from "../../services/mongo/mongoModels"

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const mongo = await getMongo();

  new Listing({
    targetAudience: {},
    createdDate: new Date(),
    isFlexible: true,
    category: "Elderly",
    desc: "description",
    title: "bla bla bla",
    requirements: "ooof",
    skills: "nope",
    place: "here we go again",
    duration: "nope",
    // time: "HELP",
    minHoursPerWeek: 8,
    maxHoursPerWeek: 10,
    requestedNumVolunteers: 4,
  }).validate().catch(console.error)

  res.status(200).json({ name: 'John Doe' })
}
