// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { createAjvJTDSchema } from "combined-validator";
import { organisations } from "../../serverAndClient/publicFieldConstants";
import { signupOrg } from "../../server/auth/data";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const signupResult = await signupOrg(req.body);

		if (!signupResult) {
			logger.info("server.signupOrg:Signup failed");
			return res
				.status(400)
				.send(
					"This did not seem to work. Can you please double-check that this email is not used?"
				);
		}

		return res.end();
	},
};

export default async function signupOrgRequest(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema(organisations)),
		}
	)(req, res);
}
