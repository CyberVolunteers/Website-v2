// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { createAjvJTDSchema } from "combined-validator";
import { ajv, createHandler } from "../../../server/apiRequests";
import { getSession } from "../../../server/auth/auth-cookie";
import { isAdminLevel } from "../../../server/auth/data";
import { HandlerCollection } from "../../../server/types";
import { Listing, Org, User } from "../../../server/mongo/mongoModels";
import { logger } from "../../../server/logger";
import { readFile } from "fs";
import { promisify } from "util";

export const config = {
	api: {
		bodyParser: false,
	},
};

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const session = await getSession(req);

		if (!isAdminLevel(session, 3)) {
			logger.warn(
				"server.admin_section_console.reloadListings.ts:Unauthorized"
			);
			return res.status(401).send("Unauthorized");
		}

		logger.warn(
			"server.admin_section_console.reloadListings.ts:reloading listings"
		);

		const listings = JSON.parse(
			(
				await promisify(readFile)(
					"/data/dataFromOldServer/listingsNewVersion.json"
				)
			).toString()
		);

		// delete all listings
		console.log(await Listing.find({}));
		await Listing.deleteMany({});
		console.log(await Listing.find({}));
		await Listing.insertMany(listings);

		console.log((await Listing.find({})).length);

		return res.send("Success");
	},
};

export default async function ReloadListing(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema({})),
		}
	)(req, res);
}
