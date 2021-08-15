// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createAjvJTDSchema } from "combined-validator";
import type { NextApiRequest, NextApiResponse } from "next";
import { ajv, createHandler } from "../../server/apiRequests";
import { Listing } from "../../server/mongo/mongoModels";
import { toStrippedObject } from "../../server/mongo/util";
import { HandlerCollection } from "../../server/types";
import { searchListingsSpec } from "../../serverAndClient/publicFieldConstants";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string
}

const handlers: HandlerCollection = {
	GET: async function (req, res) {
		const keywords = req.query.keywords;
		console.log("kw", [req.query.keywords])

		let listings;
		if (keywords === "" || typeof keywords !== "string") listings = await Listing.find();
		else {
			listings = await Listing.find(
				{ $text: { $search: keywords } },
				{ score: { $meta: "textScore" } }
			)
		}
		return res.json(listings.map(toStrippedObject));
	}
};

export default async function searchListings(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: false,
		},
		undefined,
		{
			GET: searchListingsSpec,
		}
	)(req, res);
}
