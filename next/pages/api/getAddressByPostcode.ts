// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { createAjvJTDSchema } from "combined-validator";

import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { cacheQuery } from "../../server/email/redis";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	GET: async function (req, res) {
		//TODO: ratelimit

		const postcode = req.query.postcode;
		if (Array.isArray(postcode))
			return res.status(400).send("The postcode should be a string");

		//TODO: implementation
		const address = await cacheQuery(
			postcode,
			"postcodeAddress",
			async () => "test"
		);
		console.log(postcode, address);

		return res.json({
			address,
		});
	},
};

export default async function getAddressByPostcode(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(handlers, { useCsrf: false }, undefined, {
		GET: {
			required: {
				string: {
					postcode: { maxLength: 7 },
				},
			},
		},
	})(req, res);
}
