import { createAjvJTDSchema } from "combined-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { ajv, createHandler } from "../../server/apiRequests";
import { getSession } from "../../server/auth/auth-cookie";
import { isOrg } from "../../server/auth/session";
import { createListing } from "../../server/listings";
import { HandlerCollection } from "../../server/types";
import { listings } from "../../serverAndClient/publicFieldConstants";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string
}

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		
		const session = await getSession(req);

		if (!isOrg(session)) return res.status(403).send("You need to be an organisation to do that");

		await createListing(req.body, session)

		return res.end();
	}
};

export default async function createListingRequest(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema(listings))
		})(req, res);
}
