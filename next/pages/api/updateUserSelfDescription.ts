// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { isVerifiedUser, updateUserData } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { userDataUpdateSpec } from "../../serverAndClient/publicFieldConstants";
import { ExtendedNextApiRequest, HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession, updateSession } from "../../server/auth/auth-cookie";
import { doAllRulesApply } from "../../server/validation";
import { postcodeRE } from "../../client/utils/const";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		let { occupation, languages, skillsAndInterests } = req.body as {
			occupation: string;
			languages: string;
			skillsAndInterests: string;
		};

		const session = await getSession(req);
		logger.info(
			"server.updateUserSelfDescription: updating %s with %s",
			session,
			req.body
		);
		const newData = {
			occupation,
			languages,
			skillsAndInterests,
		};
		const newDoc = await updateUserData(newData, session?.email ?? "");

		if (newDoc === null)
			return res
				.status(500)
				.send("We could not update your data. Sorry for the inconvenience.");

		await updateSession(req, res, newDoc);

		return res.json(newData);
	},
};

export default async function updateData(
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
							occupation: { maxLength: 200 },
							languages: { maxLength: 200 },
							skillsAndInterests: { maxLength: 1000 },
						},
					},
				})
			),
		}
	)(req, res);
}
