// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { changeEmail, isLoggedIn, setPassword } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import {
	getSession,
	updateSession,
} from "../../server/auth/auth-cookie";
import { verifyHash } from "../../server/auth/password";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const session = await getSession(req);

		logger.info(
			"server.passResetOldPassKnown: updating password for %s",
			session
		);

		if (session === null || !isLoggedIn(session))
			return res.status(400).send("You need to be logged in to do this");

		const { oldPassword, password } = req.body;

		// NOTE: we are not supplying a way to update the password here - this is intentional because we will set it the password later
		const verificationResult = await verifyHash(
			oldPassword,
			session.passwordHash,
			// empty function
			// eslint-disable-next-line
			() => {}
		);

		if (verificationResult === false)
			return res
				.status(400)
				.send("The old password does not appear to be correct.");

		// change the password
		const newDoc = await setPassword(session.email, password);

		// reset the session
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
							oldPassword: {},
							password: {},
						},
					},
				})
			),
		}
	)(req, res);
}
