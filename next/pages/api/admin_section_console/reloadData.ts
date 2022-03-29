// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { createAjvJTDSchema } from "combined-validator";
import { ajv, createHandler } from "../../../server/apiRequests";
import { getSession } from "../../../server/auth/auth-cookie";
import { isAdminLevel, ListingServer } from "../../../server/auth/data";
import { HandlerCollection } from "../../../server/types";
import { Listing, Org, User } from "../../../server/mongo/mongoModels";
import { logger } from "../../../server/logger";
import { readFile } from "fs";
import { promisify } from "util";
import { indexCardListings } from "../../../client/utils/const";
import { letterSpacing } from "@mui/system";

export const config = {
	api: {
		bodyParser: false,
	},
};

type Data = {
	name: string;
};

type RawListing = ListingServer & { orgId: number };

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

		const listingsRaw: RawListing[] = JSON.parse(
			(
				await promisify(readFile)(
					"/data/dataFromOldServer/listingsNewVersion.json"
				)
			).toString()
		);
		let listingsWithCustomImages: RawListing[] = [];
		let listingsWithLogosNotScraped: RawListing[] = [];
		let listingsScraped: RawListing[] = [];

		listingsRaw.forEach((l) => {
			if (l.orgId === 0) return listingsScraped.push(l);
			if (indexCardListings.some((el) => el.uuid === l.uuid))
				return listingsWithCustomImages.push(l);
			return listingsWithLogosNotScraped.push(l);
		});

		listingsWithCustomImages = pickOneByOne(listingsWithCustomImages);
		listingsWithLogosNotScraped = pickOneByOne(listingsWithLogosNotScraped);
		listingsScraped = pickOneByOne(listingsScraped);

		// make sure that the first + the last pages of "searchListings" have the listings with custom images
		const listings: RawListing[] = listingsWithCustomImages.splice(0, 12);

		listings.push(...listingsWithLogosNotScraped);
		listings.push(...listingsScraped);

		listings.push(...listingsWithCustomImages);

		// const listings = listingsRaw
		// 	// make sure that non-scraped are at the top
		// 	.sort((e1: any, e2: any) => {
		// 		let score1 = 0;
		// 		let score2 = 0;
		// 		if (e1.orgId !== 0) score1 += 1;
		// 		if (e2.orgId !== 0) score2 += 1;

		// 		return score2 - score1;
		// 	});
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
		// TODO: fill in the "listings" array in Orgs

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

function separateByOrg(listingsArray: RawListing[]) {
	const listingsByOrgId: Map<number, RawListing[]> = new Map();

	listingsArray.forEach((l) => {
		const arr = listingsByOrgId.get(l.orgId);
		if (arr === undefined) {
			listingsByOrgId.set(l.orgId, [l]);
		} else arr.push(l);
	});
	return listingsByOrgId;
}

// tries to make sure that all listings of a given charity are spread evenly,
// so if A has twice as many listings as B, we might get something similar to AABAABAAB
function pickEvenly(oldListingsArray: RawListing[]) {
	const listingsByOrgId = separateByOrg(oldListingsArray);

	const extendedListingsByOrgId: Map<
		number,
		(RawListing & { counter: number })[]
	> = new Map();

	listingsByOrgId.forEach((listingSet, key) => {
		extendedListingsByOrgId.set(
			key,
			listingSet.map((l, i) => {
				return {
					counter: i / listingSet.length,
					...l,
				};
			})
		);
	});

	const newListingsArray: RawListing[] = [];

	// imagine that as a point on a 0-1 number line and keep on moving from 0 to 1, always selecting the closest point in that order
	let counter = 0;
	while (extendedListingsByOrgId.size > 0) {
		let smallestKey = 0;
		let smallestGap = 2;
		extendedListingsByOrgId.forEach((listingSet, key) => {
			const currentGap = listingSet[0].counter - counter;
			if (currentGap < smallestGap) {
				smallestKey = key;
				smallestGap = currentGap;
			}
		});

		const listingSet = extendedListingsByOrgId.get(smallestKey);
		const newListing = listingSet?.shift?.();
		if (newListing !== undefined) newListingsArray.push(newListing);

		if (listingSet?.length === 0) extendedListingsByOrgId.delete(smallestKey);
	}

	return newListingsArray;
}

// Tries to pick charities in this order: ABCDABCDABCD...ABCABCABABAAAAA
// if a charity is missing, skip it
function pickOneByOne(oldListingsArray: RawListing[]) {
	const listingsByOrgId = separateByOrg(oldListingsArray);
	const newListingsArray: RawListing[] = [];

	while (listingsByOrgId.size > 0) {
		const orgIdsToDelete: number[] = [];
		listingsByOrgId.forEach((listings, orgId) => {
			const newListing = listings.pop();
			if (newListing === undefined) return orgIdsToDelete.push(orgId);
			newListingsArray.push(newListing);
		});

		orgIdsToDelete.forEach((orgId) => listingsByOrgId.delete(orgId));
	}

	return newListingsArray;
}
