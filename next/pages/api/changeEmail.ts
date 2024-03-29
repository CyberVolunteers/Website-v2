// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import {
	manipulateDataByEmail,
	changeEmail,
	getUserType,
	isLoggedIn,
} from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession, updateSession } from "../../server/auth/auth-cookie";
import { verifyHash } from "../../server/auth/password";
import { sendEmailConfirmationEmail } from "../../server/email";

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
		const { password, email: newEmail }: { password: string; email: string } =
			req.body;
		const session = await getSession(req);

		if (session === null)
			return res.status(400).send("Please log in to see this");

		logger.info("server.changeEmail: updating %s with %s", session, req.body);

		const { isUser, isVerifiedUser } = getUserType(session);
		if (!isUser) return res.status(400).send("Please log in as a user");

		const oldEmail = session.email;

		const passwordHash = session.passwordHash;
		if (typeof passwordHash !== "string") {
			logger.error(
				"server.changeEmail: session %s has an empty password hash",
				session
			);

			return res.status(400).send("Something went wrong");
		}

		const isPasswordCorrect = await verifyHash(
			password,
			passwordHash,
			// update the hash
			async (newHash) => {
				await manipulateDataByEmail(oldEmail, { passwordHash: newHash });
			}
		);

		if (!isPasswordCorrect)
			return res.status(400).send("The password is incorrect");

		const newDoc = await changeEmail(oldEmail, newEmail);

		if (newDoc === null)
			return res
				.status(500)
				.send(
					"We could not update your data. Maybe that email address is already used?"
				);

		await updateSession(req, res, newDoc);
		// send an email verification link
		await sendEmailConfirmationEmail(
			newEmail,
			session.firstName,
			session.lastName
		);

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
							password: {},
						},
					},
				})
			),
		}
	)(req, res);
}
