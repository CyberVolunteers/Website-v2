// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { createAjvJTDSchema } from "combined-validator";
import { organisations } from "../../serverAndClient/publicFieldConstants";
import { signupOrg } from "../../server/auth/data";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { sendEmail } from "../../server/email/nodemailer";
import { notificationsEmail } from "../../serverAndClient/staticDetails";
import { isValid, signupValidation } from "../../server/validation";
import { disableSession, updateSession } from "../../server/auth/auth-cookie";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const signupResult = await signupOrg(req.body);

		if (!isValid(req.body, signupValidation))
			return res
				.status(400)
				.send(
					"This data does not seem correct. Could you please double-check it?"
				);

		if (signupResult === false) {
			logger.info("server.signupOrg:Signup failed");
			return res
				.status(400)
				.send(
					"This did not seem to work. Can you please double-check that this email is not used?"
				);
		}

		// send a notification
		// can be done out-of-sync, so no await here
		sendEmail({
			to: notificationsEmail,
			subject: "<Notification> A charity just signed up",
			text: `The charity is called "${req.body.orgName}", its email is "${req.body.email}" and it needs to be verified`,
		});

		// log in the poor soul
		// Delete the session cache so that the data does not persist
		disableSession(req);
		await updateSession(req, res, signupResult);

		return res.end();
	},
};

export default async function signupOrgRequest(
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<void> {
	const fields = Object.assign({}, organisations);
	delete fields.required?.string?.contactEmails;
	await createHandler(
		handlers,
		{
			useCsrf: true,
		},
		{
			POST: ajv.compileParser(createAjvJTDSchema(fields)),
		}
	)(req, res);
}
