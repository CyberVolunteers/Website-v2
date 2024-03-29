// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { isResult, signupUser } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import {
	emailLengthField,
	postcodeLengthField,
	shortField,
} from "../../serverAndClient/publicFieldConstants";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import {
	clearServerSideSession,
	updateSession,
} from "../../server/auth/auth-cookie";
import isEmail from "validator/lib/isEmail";
import { sendEmailConfirmationEmail } from "../../server/email";
import { isPostcode } from "../../serverAndClient/utils";

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
		const {
			firstName,
			lastName,
			email,
			password,
			address1,
			address2,
			postcode: _postcode,
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
		const postcode = _postcode.toUpperCase();
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

		if (!isPostcode(postcode))
			return res
				.status(400)
				.send("The postcode seems wrong. Could you please double-check it?");

		if (!isEmail(email))
			return res
				.status(400)
				.send("The email seems wrong. Could you please double-check it?");

		const signupResult = await signupUser({
			firstName,
			lastName,
			email,
			password,
			address1,
			address2,
			postcode,
			city,
			birthDate,
		});

		if (isResult(signupResult)) {
			logger.info("server.signupUser:Signup failed");
			return res
				.status(400)
				.send(`This did not seem to work: ${signupResult.errorMessage}.`);
		}

		// send an email verification link
		await sendEmailConfirmationEmail(email, firstName, lastName);

		// log in the poor soul
		// Delete the session cache so that the data does not persist
		clearServerSideSession(req);
		await updateSession(req, res, signupResult.result);

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
							firstName: { maxLength: shortField },
							lastName: { maxLength: shortField },
							email: { maxLength: emailLengthField, client_specialEdit: true },
							password: { client_specialEdit: true },
							address1: { maxLength: shortField },
							postcode: { maxLength: postcodeLengthField },

							city: { maxLength: shortField },
							// assuming it is UK for now
							// country: { maxLength: 56 },
						},
						date: {
							birthDate: {},
						},
					},
					optional: {
						string: {
							address2: { maxLength: shortField },
						},
					},
				})
			),
		}
	)(req, res);
}
