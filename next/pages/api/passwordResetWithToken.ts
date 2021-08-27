// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { changeEmail, isLoggedIn, setPassword } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession, updateSession } from "../../server/auth/auth-cookie";
import { verifyUUID } from "../../server/email/redis";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const { email, uuid, password } = req.body;

		logger.info(
			"server.passwordResetWithToken: updating %s with %s",
			email,
			uuid
		);

		const isCorrectUUID = await verifyUUID(email, uuid, "passwordResetUUID");

		if(!isCorrectUUID) return res.status(400).send("We are sorry, but this link has expired");

		const newDoc = await setPassword(email, password);

		if (newDoc === null)
			return res
				.status(500)
				.send("We could not update your data. Sorry for the inconvenience.");

		await updateSession(req, res, newDoc._doc);

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
							uuid: { exactLength: 36 },
							password: {},
						},
					},
				})
			),
		}
	)(req, res);
}
