// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { HandlerCollection } from "../../server/types";
import { createAjvJTDSchema } from "combined-validator";
import { getPostcode, rawGetPlaceAutocomplete } from "../../server/location";
import { logger } from "../../server/logger";

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
		const rawQ = req.body.query;
		if (typeof rawQ !== "string")
			return res.status(400).send("A string was expected");

		const q = rawQ
			// only keep allowed characters
			.replaceAll(/[^ 0-9a-zA-Z.:;,-]/g, " ")
			// only leave one space
			.replaceAll(/ +/g, " ");

		const placeAutocompleteResults = await rawGetPlaceAutocomplete(`${q}, UK`);
		if (placeAutocompleteResults.status >= 400) {
			logger.warn(
				`server.getAddressInfo: failed to autocomplete "${placeAutocompleteResults.statusText}" for the query "${q}"`
			);
			return res
				.status(400)
				.send("The autocomplete request did not work properly");
		}

		return res.json({ results: placeAutocompleteResults.data.predictions });
	},
};

export default async function getAddressSuggestions(
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
							query: {},
						},
					},
				})
			),
		}
	)(req, res);
}
