// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { HandlerCollection } from "../../server/types";
import { createAjvJTDSchema } from "combined-validator";
import {
	getPostcode as _getPostcode,
	rawGetPlaceAutocomplete,
} from "../../server/location";
import { logger } from "../../server/logger";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const rawQ = req.body.place_id;
		if (typeof rawQ !== "string")
			return res.status(400).send("A string was expected");

		return res.json({ results: await _getPostcode(rawQ) });
	},
};

export default async function getPostcode(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{ useCsrf: false },
		{
			POST: ajv.compileParser(
				createAjvJTDSchema({
					required: {
						string: {
							place_id: {},
						},
					},
				})
			),
		}
	)(req, res);
}
