// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler } from "../../server/apiRequests";
import { isEmailFree } from "../../server/auth/data";
import { Listing } from "../../server/mongo/mongoModels";
import { HandlerCollection } from "../../server/types";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	GET: async function (req, res) {
		const max = await Listing.find({}, "maxHoursPerWeek -_id")
			.sort({
				maxHoursPerWeek: -1,
			})
			.limit(1);
		return res.json({ max, min: 0 });
	},
};

export default async function getHoursPerWeekLimits(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(handlers, {
		useCsrf: false,
	})(req, res);
}
