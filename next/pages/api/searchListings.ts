// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createAjvJTDSchema } from "combined-validator";
import type { NextApiRequest, NextApiResponse } from "next";
import { ajv, createHandler } from "../../server/apiRequests";
import { Listing } from "../../server/mongo/mongoModels";
import { toStrippedObject } from "../../server/mongo/util";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { searchListingsSpec } from "../../serverAndClient/publicFieldConstants";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string
}

const handlers: HandlerCollection = {
	GET: async function (req, res) {
		const keywords = req.query.keywords;

		let listings;
		if (keywords === "" || typeof keywords !== "string") {
			logger.info("server.searchListings:Search all");
			listings = await Listing.find();
		}
		else {
			logger.info("server.searchListings:Search keywords '%s'", keywords);
			listings = await Listing.find(
				{ $text: { $search: keywords } },
				{ score: { $meta: "textScore" } }
			)
		}
		return res.json(listings.map(toStrippedObject));
	}
};

/*
async getLatAndLong(placeDesc) {
    logger.info("Pinging google services");
    const geocodeString = `https://maps.googleapis.com/maps/api/geocode/json?address=${escape(
      placeDesc.replace(" ", "+")
    )}&key=<key>`;
    const response = await axios.get(geocodeString);
    if (response.data.results.length === 0) return {};
    return response.data.results[0].geometry.location; //lat, lng
  }

*/

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
