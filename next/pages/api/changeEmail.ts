// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { changeEmail, isLoggedIn } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { HandlerCollection } from "../../server/types";
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

		logger.info("server.changeEmail: updating %s with %s", session, req.body);

		if (!isLoggedIn(session))
			return res.status(400).send("You need to be logged in to do this");

		const oldEmail = session.email;

		const newDoc = await changeEmail(oldEmail, req.body.email);

		if (newDoc === null)
			return res
				.status(500)
				.send("We could not update your data. Sorry for the inconvenience.");

		await updateSession(req, res, newDoc);

		return res.end();
	},
};

export default async function changeEmailRequest(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(
				createAjvJTDSchema({
					required: {
						string: {
							email: { maxLength: 320 },
						},
					},
				})
			),
		}
	)(req, res);
}
