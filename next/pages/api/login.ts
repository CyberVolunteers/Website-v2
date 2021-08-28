// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { isLoggedIn, login } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import {
	disableSession,
	getSession,
	updateSession,
} from "../../server/auth/auth-cookie";
import { HandlerCollection } from "../../server/types";
import { loginSpec } from "../../serverAndClient/publicFieldConstants";
import { logger } from "../../server/logger";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const session = await getSession(req);

		if (isLoggedIn(session)) {
			logger.info("server.login:Signing in a someone else");
			// Delete the session cache so that the data does not persist
			disableSession(req);
		}

		const loginResult = await login(req.body);

		if (!loginResult) {
			logger.info("server.login:Incorrect username or password");
			return res
				.status(400)
				.send(
					"This email and password combination does not appear to be correct"
				);
		}

		await updateSession(req, res, loginResult);

		return res.end();
	},
};

export default async function loginRequest(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema(loginSpec)),
		}
	)(req, res);
}
