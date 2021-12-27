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
		// logger.info("server.searchListings: %s", req.query);
		// const { keywords, targetLoc, category, minHours, maxHours, isOnline } =
		// 	req.query;

		// const searchObj1 = {} as { [key: string]: any };
		// const searchObj2 = {} as { [key: string]: any };

		// // Pre-checks
		// if (
		// 	typeof targetLoc === "string" &&
		// 	typeof isOnline !== "undefined" &&
		// 	isOnline === "true"
		// )
		// 	return res
		// 		.status(400)
		// 		.send(
		// 			"Please make sure to include offline searches when sorting by location."
		// 		);

		// // keywords
		// if (keywords !== "" && typeof keywords === "string") {
		// 	searchObj1.$text = { $search: keywords };
		// 	searchObj2.textScore = { $meta: "textScore" };
		// }

		// if (typeof minHours === "string") {
		// 	const minHoursFloat = parseFloat(minHours);
		// 	if (!isNaN(minHoursFloat))
		// 		searchObj1.maxHoursPerWeek = { $gte: minHoursFloat };
		// }

		// if (typeof maxHours === "string") {
		// 	const maxHoursFloat = parseFloat(maxHours);
		// 	if (!isNaN(maxHoursFloat))
		// 		searchObj1.minHoursPerWeek = { $lte: maxHoursFloat };
		// }

		// if (typeof isOnline !== "undefined") {
		// 	searchObj1["location.isOnline"] = isOnline === "true";
		// }

		// if (typeof category === "string") {
		// 	searchObj1.category = category;
		// }

		// let latLongPair: [lat: number, long: number] | undefined = undefined;

		// // check beforehand
		// if (typeof targetLoc === "string") {
		// 	// find the location
		// 	latLongPair = await getLatAndLong(targetLoc + ", UK");
		// 	if (latLongPair === undefined)
		// 		return res
		// 			.status(400)
		// 			.send(
		// 				"Sorry, we could not find this location. There is a greater chance of this working with an address"
		// 			);
		// }

		// // the actual search
		// let listings = await Listing.find(searchObj1, searchObj2).populate(
		// 	"organisation"
		// );

		// let distances: { distance: number }[] = [];

		// if (typeof targetLoc === "string") {
		// 	const ids = listings.map((l: any) => l._id);
		// 	// search for distances
		// 	distances = await Listing.aggregate([
		// 		{
		// 			$geoNear: {
		// 				near: { type: "Point", coordinates: latLongPair },
		// 				distanceField: "distance",
		// 				query: {
		// 					_id: { $in: ids },
		// 					"location.isOnline": false,
		// 				},
		// 			},
		// 		},
		// 		{
		// 			$project: { distance: 1, uuid: 1, _id: 0 },
		// 		},
		// 	]);
		// }

		// listings = listings.map((l: any) => ({
		// 	maxHoursPerWeek: l.maxHoursPerWeek,
		// 	minHoursPerWeek: l.minHoursPerWeek,
		// 	imagePath: l.imagePath,
		// 	title: l.title,
		// 	organisationName: l.organisation?.orgName,
		// 	desc: l.desc,
		// 	currentVolunteers: l.currentNumVolunteers,
		// 	requestedVolunteers: l.requestedNumVolunteers,
		// 	uuid: l.uuid,
		// 	textScore: l._doc.textScore, // for some weird reason has to be accessed through _doc and not directly
		// }));

		// return res.json({
		// 	listings,
		// 	distances,
		// });
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
