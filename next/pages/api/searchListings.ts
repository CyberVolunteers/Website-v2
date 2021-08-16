// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler } from "../../server/apiRequests";
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
		logger.info("server.searchListings: %s", req.query);
		const keywords = req.query.keywords;

		const searchObj1 = {} as { [key: string]: any };
		const searchObj2 = {} as { [key: string]: any };

		if (keywords !== "" && typeof keywords === "string") {
			searchObj1.$text = { $search: keywords };
			searchObj2.score = { $meta: "textScore" };
		}
		else {
			logger.info("server.searchListings:Search keywords '%s'", keywords);

		}

		let listings = await Listing.find(searchObj1, searchObj2).populate("organisation");

		listings = listings.map(toStrippedObject)
		listings = listings.map((l: any) => ({
			imagePath: l.imagePath,
			title: l.title,
			organisationName: l.organisation?.orgName,
			desc: l.desc,
			currentVolunteers: l.currentNumVolunteers,
			requestedVolunteers: l.requestedNumVolunteers,
			uuid: l.uuid
		}))

		return res.json(listings);
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
