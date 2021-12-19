// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { isResult, login, signupUser } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { users } from "../../serverAndClient/publicFieldConstants";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { stringify } from "ajv";
import { doAllRulesApply } from "../../server/validation";
import {
	clearServersideSession,
	updateSession,
} from "../../server/auth/auth-cookie";
import { schemaHasRules } from "ajv/dist/compile/util";
import isEmail from "validator/lib/isEmail";
import { postcodeRE } from "../../client/utils/const";
import { sendEmailConfirmationEmail } from "../../server/email";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		let {
			firstName,
			lastName,
			email,
			password,
			address1,
			address2,
			postcode,
			city,
			birthDate: birthDateString,
		} = req.body as {
			firstName: string;
			lastName: string;
			email: string;
			password: string;
			address1: string;
			postcode: string;
			city: string;
			birthDate: string;
			address2?: string;
		};
		const birthDate = new Date(birthDateString);
		postcode = postcode.toUpperCase();
		// NOTE: does not check the location

		// Fields:
		/* 
		firstName
		lastName
		Email
		Password
		address1
		address2?

		postcode
		town
		Date
		
		 */
		if (
			[firstName, lastName, email, password, address1, postcode, city].includes(
				""
			)
		)
			return res
				.status(400)
				.send("Some data is missing. Could you please double-check it?");

		if (!postcodeRE.test(postcode))
			return res
				.status(400)
				.send("The postcode seems wrong. Could you please double-check it?");

		if (!isEmail(email))
			return res
				.status(400)
				.send("The email seems wrong. Could you please double-check it?");

		const signupResult = await signupUser(req.body);

		if (isResult(signupResult)) {
			logger.info("server.signupUser:Signup failed");
			return res
				.status(400)
				.send(`This did not seem to work: ${signupResult}.`);
		}

		// send an email verification link
		await sendEmailConfirmationEmail(email);

		// log in the poor soul
		// Delete the session cache so that the data does not persist
		clearServersideSession(req);
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
			POST: ajv.compileParser(
				createAjvJTDSchema({
					required: {
						string: {
							firstName: { maxLength: 30 },
							lastName: { maxLength: 30 },
							email: { maxLength: 320, client_specialEdit: true },
							password: { client_specialEdit: true },
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
						},
					},
				})
			),
		}
	)(req, res);
}
