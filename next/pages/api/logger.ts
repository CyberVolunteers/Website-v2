// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { createAjvJTDSchema } from "combined-validator";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession } from "../../server/auth/auth-cookie";
import { isLoggedIn } from "../../server/auth/data";

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
		const session = await getSession(req);

		const { level, path, message } = req.body;
		const userInfo =
			isLoggedIn(session) && session !== null ? session._id : "Logged out user";

		logger.log(level, `client.${path}:${message}; User: ${userInfo}`);

		return res.end();
	},
};

export default async function loggerRequest(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(
		handlers,
		{
			useCsrf: false,
		},
		{
			POST: ajv.compileParser(
				createAjvJTDSchema({
					required: {
						string: {
							level: {
								enum: [
									"error",
									"warn",
									"info",
									"http",
									"verbose",
									"debug",
									"silly",
								],
							},
							path: {},
							message: {},
						},
					},
				})
			),
		}
	)(req, res);
}
