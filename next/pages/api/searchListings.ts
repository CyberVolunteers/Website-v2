// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { Listing } from "../../server/mongo/mongoModels";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { createAjvJTDSchema } from "combined-validator";
import { geocode } from "../../server/location";
import {
	distanceRelativeScore,
	maxSearchDistanceMeters,
} from "../../client/utils/const";

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
		let couldLocationBeUsed = false;

		let timeQuery: null | "flexible" | [number, number] = null;
		if (req.body.isFlexible) timeQuery = "flexible";
		else if (
			typeof req.body.minHours === "number" &&
			typeof req.body.maxHours === "number"
		)
			timeQuery = [req.body.minHours, req.body.maxHours];

		let location: string | null = null;
		if (typeof req.body.location === "string") location = req.body.location;

		let keywords: string[] | null = null;
		if (Array.isArray(req.body.keywords)) keywords = req.body.keywords;

		let categories: string[] | null = null;
		if (Array.isArray(req.body.categories)) categories = req.body.categories;

		const searchObj: {
			$text?: { $search: string };
			categories?: { $in: string[] };
			isFlexible?: boolean;
			$and?: [
				{ maxHoursPerWeek: { $gte: number } },
				{ minHoursPerWeek: { $lte: number } }
			];
		} = {};

		const selectObj: {
			[key: string]: number | { $meta: string };
		} = {
			uuid: 1,
		};

		if (keywords !== null && keywords.length > 0) {
			searchObj.$text = { $search: keywords.join(", ") };
			selectObj.textScore = { $meta: "textScore" };
		}

		if (categories !== null && categories.length > 0) {
			searchObj.categories = { $in: categories };
		}

		if (timeQuery === "flexible") {
			searchObj.isFlexible = true;
		} else if (Array.isArray(timeQuery)) {
			const [requestMinHoursPerWeek, requestMaxHoursPerWeek] = timeQuery;
			// !(maxHoursPerWeek < requestMinHoursPerWeek || minHoursPerWeek > requestMaxHoursPerWeek)
			// (maxHoursPerWeek >= requestMinHoursPerWeek && minHoursPerWeek <= requestMaxHoursPerWeek)
			searchObj.$and = [
				{ maxHoursPerWeek: { $gte: requestMinHoursPerWeek } },
				{ minHoursPerWeek: { $lte: requestMaxHoursPerWeek } },
			];
		}

		const listings: {
			_id?: string;
			uuid: string;
			textScore?: number;
			distanceScore?: number;
			score?: number;
		}[] = await Listing.find(searchObj, selectObj, { lean: true });

		if (typeof location === "string") {
			const resolvedLoc = await geocode(`${location}, UK`);
			if (resolvedLoc !== null) {
				const { lat, lng } = resolvedLoc;
				couldLocationBeUsed = true;
				const distances = await Listing.aggregate([
					{
						$geoNear: {
							near: { type: "Point", coordinates: [lng, lat] },
							distanceField: "distance",
							query: {
								_id: { $in: listings.map((l) => l._id) },
							},
							maxDistance: maxSearchDistanceMeters,
						},
					},
					{
						$project: { distance: 1, uuid: 1, _id: 0 },
					},
				]);

				const scaledDistancesByUUID = Object.fromEntries(
					distances.map((l) => [l.uuid, Math.log10(l.distance)])
				);

				listings.forEach((l, i) => {
					if (
						scaledDistancesByUUID[l.uuid] !== undefined &&
						scaledDistancesByUUID[l.uuid] > 0
					)
						listings[i].distanceScore = scaledDistancesByUUID[l.uuid];
				});
			}
		}

		const listingsWithFinalScore = listings.map((l) => {
			l.score =
				(l.textScore ?? 0) - distanceRelativeScore * (l.distanceScore ?? 0);
			delete l._id;
			return l;
		});

		return res.json({
			couldLocationBeUsed,
			results: listingsWithFinalScore,
		});
	},
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
		{
			POST: ajv.compileParser(
				createAjvJTDSchema({
					optional: {
						string: {
							location: {},
							keywords: { array: true },
							categories: { array: true },
						},
						number: {
							minHours: {},
							maxHours: {},
						},
						boolean: {
							isFlexible: {},
						},
					},
				})
			),
		}
	)(req, res);
}
