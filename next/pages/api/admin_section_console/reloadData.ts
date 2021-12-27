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
		)
			// make sure that non-scraped are at the top
			.sort((e1: any, e2: any) => {
				let score1 = 0;
				let score2 = 0;
				if (e1.orgId !== 0) score1 += 1;
				if (e2.orgId !== 0) score2 += 1;

				return score2 - score1;
			});
		const orgs = JSON.parse(
			(
				await promisify(readFile)("/data/dataFromOldServer/orgsNewVersion.json")
			).toString()
		);

		// delete all listings
		logger.info(
			"Length before - listings: %s",
			(await Listing.find({})).length
		);
		logger.info("Length before - orgs: %s", (await Org.find({})).length);

		await Listing.deleteMany({});
		await Org.deleteMany({});

		logger.info(
			"Length after delete - listings: %s",
			(await Listing.find({})).length
		);
		logger.info("Length after delete - orgs: %s", (await Org.find({})).length);

		const newOrg = await Org.insertMany(orgs);

		const newIdsByOldIds: { [key: number]: string } = {};
		(newOrg as any[]).forEach((o, i) => {
			newIdsByOldIds[orgs[i].id] = o._id;
		});

		listings.forEach((l: any) => {
			l.organisation = newIdsByOldIds[l.orgId];
		});

		await Listing.insertMany(listings);
		// TODO: fill in the "listings" array in Org

		logger.info(
			"Length after insert - listings: %s",
			(await Listing.find({})).length
		);
		logger.info("Length after insert - orgs: %s", (await Org.find({})).length);
		logger.info("First thing in the listing: %s", (await Listing.find({}))[0]);

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
