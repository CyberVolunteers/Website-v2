// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { addUserToListing, isUser } from "../../server/auth/data";
import { createAjvJTDSchema } from "combined-validator";
import { users } from "../../serverAndClient/publicFieldConstants";
import { HandlerCollection } from "../../server/types";
import { logger } from "../../server/logger";
import { getSession } from "../../server/auth/auth-cookie";
import { sendEmail } from "../../server/email/nodemailer";
import { Org } from "../../server/mongo/mongoModels";
import { getPresentableName } from "../../client/components/FormComponent";
import { userFieldNamesToShowPublic } from "../../serverAndClient/displayNames";

export * from "../../server/defaultEndpointConfig";

type Data = {
	name: string;
};

const handlers: HandlerCollection = {
	POST: async function (req, res) {
		const session = await getSession(req);

		if (!isUser(session))
			return res.status(400).send("You need to be a user to do this");

		// TODO: check that all the fields are there
		const missingFields = session.missingFields;

		const newListingValue = await addUserToListing(session._id, req.body.uuid);

		if (newListingValue === null)
			return res
				.status(400)
				.send("It looks like you have already joined this listing");

		// send a notification
		// can be done out-of-sync, so no await here
		(async function () {
			const orgId = newListingValue.organisation;
			const org = await Org.findById(orgId);

			const email = org?.email;

			const requiredFields = newListingValue.requiredData;

			const fields = requiredFields.map(
				(fieldName: string) =>
					`${getPresentableName(fieldName, userFieldNamesToShowPublic)}: ${
						session[fieldName]
					}`
			);

			if (email)
				await sendEmail({
					to: email,
					subject: `<Notification> Someone has signed up for the listing "${newListingValue.title}"`,
					text: `User data: ${fields.join(", ")}`,
				});
		})();

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
							uuid: {},
						},
					},
				})
			),
		}
	)(req, res);
}
