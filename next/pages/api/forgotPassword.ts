// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { changeEmail, isLoggedIn } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession, updateSession } from "../../server/auth/auth-cookie";
import { sendEmailWithUUID } from "../../server/email";
import { protocolAndHost } from "../../serverAndClient/staticDetails";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const email = req.body.email;

		logger.info("server.forgotPassword: request for %s", email);

		await sendEmailWithUUID(
			email,
			(uuid: string) => {
				const link = `${protocolAndHost}/passwordResetWithToken?${new URLSearchParams(
					{
						uuid,
						email,
					}
				)}`;

				return {
					html: `<a href="${link}">Reset the password!</a>`,
					text: `Please go to this webpage: ${link}`,
				};
			},
			"passwordResetUUID",
			{
				subject: "Password reset",
			}
		);

		return res.end();
	},
};

export default async function forgotPassword(
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
						},
					},
				})
			),
		}
	)(req, res);
}
