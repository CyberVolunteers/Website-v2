// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { changeEmail, isLoggedIn, setPassword } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession, updateSession } from "../../server/auth/auth-cookie";
import { destroyUUID, verifyUUID } from "../../server/email/redis";
import { getMongo } from "../../server/mongo";
import { incorrectUUIDError } from "../../client/utils/const";

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
		const {
			email,
			uuid,
			password,
		}: { email: string; uuid: string; password: string } = req.body;

		logger.info("server.passwordResetFinal: updating %s with %s", email, uuid);

		let isSuccessful = await verifyUUID(email, uuid, "passwordResetUUID");
		if (isSuccessful) return res.status(400).send(incorrectUUIDError);
		await destroyUUID(email, "passwordResetUUID");

		// connect mongo
		//TODO: somehow make it impossible to miss this?
		await getMongo();

		// set the values
		const newDoc = setPassword(email, password);
		await updateSession(req, res, newDoc);

		return res.end();
	},
};

export default async function passwordResetFinal(
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
