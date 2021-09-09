// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { login, signupUser } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { users } from "../../serverAndClient/publicFieldConstants";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { stringify } from "ajv";
import { isValid, signupValidation } from "../../server/validation";
import { disableSession, updateSession } from "../../server/auth/auth-cookie";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const signupResult = await signupUser(req.body);

		if (!isValid(req.body, signupValidation))
			return res
				.status(400)
				.send(
					"This data does not seem correct. Could you please double-check it?"
				);

		if (signupResult === false) {
			logger.info("server.signupUser:Signup failed");
			return res
				.status(400)
				.send(
					"This did not seem to work. Can you please double-check that this email is not used?"
				);
		}

		// log in the poor soul
		console.log(signupResult);
		// Delete the session cache so that the data does not persist
		disableSession(req);
		await updateSession(req, res, signupResult);

		return res.end();
	},
};

export default async function signUp(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema(users)),
		}
	)(req, res);
}
