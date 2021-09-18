// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { isUser, updateUserData } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { userDataUpdateSpec } from "../../serverAndClient/publicFieldConstants";
import { ExtendedNextApiRequest, HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession, updateSession } from "../../server/auth/auth-cookie";
import { isValid, signupValidation } from "../../server/validation";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const session = await getSession(req);

		if (!isValid(req.body, signupValidation))
			return res
				.status(400)
				.send(
					"This data does not seem correct. Could you please double-check it?"
				);

		logger.info(
			"server.updateUserData: updating %s with %s",
			session,
			req.body
		);

		if (!isUser(session))
			return res.status(400).send("You need to be a user to do this");

		const newDoc = await updateUserData(req.body, session.email);

		if (newDoc === null)
			return res
				.status(500)
				.send("We could not update your data. Sorry for the inconvenience.");

		await updateSession(req, res, newDoc._doc);

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
			POST: ajv.compileParser(createAjvJTDSchema(userDataUpdateSpec)),
		}
	)(req, res);
}