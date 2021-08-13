// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createAjvJTDSchema } from "combined-validator";
import type { NextApiRequest, NextApiResponse } from "next";
import { ajv, createHandler } from "../../server/apiRequests";
import { HandlerCollection } from "../../server/types";
import { searchListingsSpec } from "../../serverAndClient/publicFieldConstants";

export * from "../../server/defaultEndpointConfig";

type Data = {
    name: string
}

const handlers: HandlerCollection = {
	GET: async function (req, res) {
		return res.json({});
	}
};

export default async function searchListings (
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: false,
		},
		{
			GET: ajv.compileParser(createAjvJTDSchema(searchListingsSpec))
		}
		)(req, res);
}
