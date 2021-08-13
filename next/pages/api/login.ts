// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { isLoggedIn, login } from "../../server/auth/session";
import { createAjvJTDSchema } from "combined-validator";
import { getSession, updateSession } from "../../server/auth/auth-cookie";
import { HandlerCollection } from "../../server/types";
import { loginSpec, users } from "../../serverAndClient/publicFieldConstants";
import { Listing, Org, User } from "../../server/mongo/mongoModels";

import { connection } from "mongoose";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string
}

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const session = await getSession(req);

		if (isLoggedIn(session)) console.log("Signing in a someone else"); //TODO: replace with logging

		const loginResult = await login(req.body);

		if (!loginResult) return res.status(400).send("This email and password combination does not appear to be correct");

		await updateSession(req, res, loginResult);

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
