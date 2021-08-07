// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { isLoggedIn, login } from "../../server/auth/session";
import { createAjvJTDSchema } from "combined-validator";
import { getSession, updateSession } from "../../server/auth/auth-cookie";
import { HandlerCollection } from "../../server/types";
import { loginSpec } from "../../serverAndClient/publicFieldConstants";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string
}

const handlers: HandlerCollection = {
	POST: async function (req, res) {

		const session = await getSession(req);

		if (isLoggedIn(session)) return res.send("Already signed in");

		const loginResult = await login(req.body);

		if (!loginResult) return res.status(400).send("This email and password combination does not appear to be correct");

		await updateSession(req, res, loginResult); //TODO: add some data here

		return res.end();
	}
};

export default async function loginRequest(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema(loginSpec))
		})(req, res);
}
