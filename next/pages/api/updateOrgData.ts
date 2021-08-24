// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { isOrg, updateOrgData } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { orgDataUpdateSpec } from "../../serverAndClient/publicFieldConstants";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession, updateSession } from "../../server/auth/auth-cookie";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const session = await getSession(req);

		logger.info("server.updateOrgData: updating %s with %s", session, req.body);

		if (!isOrg(session))
			return res.status(400).send("You need to be an organisation to do this");

		const newDoc = await updateOrgData(req.body, session.email);

		if (newDoc === null)
			return res
				.status(500)
				.send("We could not update your data. Sorry for the inconvenience.");

		await updateSession(req, res, newDoc);

		return res.end();
	},
};

export default async function updateData(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	// console.log(orgDataUpdateSpec);
	await createHandler(
		handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema(orgDataUpdateSpec)),
		}
	)(req, res);
}
