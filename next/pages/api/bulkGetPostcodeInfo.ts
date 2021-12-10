// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { HandlerCollection } from "../../server/types";
import { createAjvJTDSchema } from "combined-validator";
// import { getSpecificIdentifiers } from "../../server/location";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		// 	const rawQ = req.body.query;
		// 	if (!Array.isArray(rawQ))
		// 		return res.status(400).send("An array of strings was expected");
		// 	if (rawQ.length > 10) return res.status(400).send("The array is too large");
		// 	const query = rawQ.map((e) =>
		// 		e
		// 			// only keep allowed characters
		// 			.replaceAll(/[^0-9a-zA-Z]/g, "")
		// 	);
		// 	const genericAddressPromises = query.map((el) =>
		// 		getSpecificIdentifiers(el, "postcodeByStreet")
		// 	);
		// 	const genericAddresses = await Promise.all(genericAddressPromises);
		// 	console.log(genericAddresses);
		// 	return res.json({ query });
	},
};

export default async function bulkGetPostcodeInfo(
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
							query: { array: true },
						},
					},
				})
			),
		}
	)(req, res);
}
