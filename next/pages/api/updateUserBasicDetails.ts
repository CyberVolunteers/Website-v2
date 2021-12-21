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
		let {
			firstName,
			lastName,
			address1,
			address2: address2Raw,
			postcode,
			city,
			birthDate: birthDateString,

			gender: genderRaw,
			phoneNumber: phoneNumberRaw,
		} = req.body as {
			firstName: string;
			lastName: string;
			address1: string;
			postcode: string;
			city: string;
			birthDate: string;
			address2?: string;

			phoneNumber?: string;
			gender?: "" | "m" | "f" | "o";
		};
		const birthDate = new Date(birthDateString);
		postcode = postcode.toUpperCase();
		const address2 = address2Raw ?? "";
		const phoneNumber = phoneNumberRaw ?? "";
		const gender = genderRaw ?? "";

		// NOTE: does not check the location

		if ([firstName, lastName, address1, postcode, city].includes(""))
			return res
				.status(400)
				.send("Some data is missing. Could you please double-check it?");

		if (!postcodeRE.test(postcode))
			return res
				.status(400)
				.send("The postcode seems wrong. Could you please double-check it?");

		if (phoneNumber !== "" && !isMobilePhone(phoneNumber))
			return res
				.status(400)
				.send(
					"The phone number seems wrong. Could you please double-check it?"
				);

		const session = await getSession(req);
		logger.info(
			"server.updateUserBasicDetails: updating %s with %s",
			session,
			req.body
		);
		const newData = {
			firstName,
			lastName,
			address1,
			address2,
			postcode,
			city,
			birthDate,

			gender,
			phoneNumber,
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
							firstName: { maxLength: 30 },
							lastName: { maxLength: 30 },
							address1: { maxLength: 100 },
							postcode: { maxLength: 8 },

							city: { maxLength: 85 },
							// assuming it is UK for now
							// country: { maxLength: 56 },
						},
						date: {
							birthDate: {},
						},
					},
					optional: {
						string: {
							address2: { maxLength: 100 },
							gender: { enum: ["m", "f", "o"] },
							phoneNumber: { isPhoneNumber: true },
						},
					},
				})
			),
		}
	)(req, res);
}
