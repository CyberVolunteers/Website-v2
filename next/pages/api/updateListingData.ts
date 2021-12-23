// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import {
	isVerifiedOrg,
	isVerifiedUser,
	updateListingData,
	updateUserData,
} from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import {
	listingDataUpdateSpec,
	userDataUpdateSpec,
} from "../../serverAndClient/publicFieldConstants";
import { ExtendedNextApiRequest, HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession, updateSession } from "../../server/auth/auth-cookie";

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
		const session = await getSession(req);

		logger.info(
			"server.updateListingData: updating listing %s by %s with %s",
			req.body.uuid,
			session,
			req.body
		);

		if (!isVerifiedOrg(session))
			return res.status(400).send("You need to be a charity to do this");

		const orgId = session._id;

		const newDoc = await updateListingData(req.body, orgId, req.body.uuid);

		if (newDoc === null)
			return res
				.status(500)
				.send("We could not update your data. Sorry for the inconvenience.");

		return res.end();
	},
};

export default async function updateData(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema(listingDataUpdateSpec)),
		}
	)(req, res);
}
