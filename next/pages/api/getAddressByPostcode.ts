// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { createAjvJTDSchema } from "combined-validator";

import { HandlerCollection } from "../../server/types";
import { getAddressByPostcodeSpec } from "../../serverAndClient/publicFieldConstants";
import { logger } from "../../server/logger";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	GET: async function (req, res) {
		//TODO: ratelimit

		//TODO: implementation

		return res.end();
	},
};

export default async function getAddressByPostcode(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{ useCsrf: true },
		{
			GET: ajv.compileParser(createAjvJTDSchema(getAddressByPostcodeSpec)),
		}
	)(req, res);
}
