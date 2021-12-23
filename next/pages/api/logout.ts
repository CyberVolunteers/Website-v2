// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler } from "../../server/apiRequests";
import { removeSession } from "../../server/auth/auth-cookie";
import { HandlerCollection } from "../../server/types";

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
		await removeSession(res);
		return res.end();
	},
};

export default async function logout(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	await createHandler(handlers, {
		useCsrf: true,
	})(req, res);
}
