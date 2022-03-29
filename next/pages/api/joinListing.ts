// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createHandler, ajv } from "../../server/apiRequests";
import { createAjvJTDSchema } from "combined-validator";
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
		// const session = await getSession(req);

		// if (!isVerifiedUser(session))
		// 	return res.status(400).send("You need to be a user to do this");

		// // TODO: check that all the required fields are there
		// const missingFields = session.missingFields;

		// const newListingValue = await addUserToListing(session._id, req.body.uuid);

		// if (newListingValue === null)
		// 	return res
		// 		.status(400)
		// 		.send("It looks like you have already joined this listing");

		// // send a notification
		// // can be done out-of-sync, so no await here
		// (async function () {
		// 	const orgId = newListingValue.organisation;
		// 	const org = await Org.findById(orgId)._doc;

		// 	const email = session?.email;

		// 	const requiredFields = newListingValue.requiredData;

		// 	const fields = requiredFields.map(
		// 		(fieldName: string) =>
		// 			`${getPresentableName(fieldName, userFieldNamesToShowPublic)}: ${
		// 				session[fieldName]
		// 			}`
		// 	);

		// 	if (Array.isArray(org.contactEmails))
		// 		await sendEmail({
		// 			to: org.contactEmails,
		// 			subject: `<Notification> Someone has signed up for the listing "${newListingValue.title}"`,
		// 			text: `User data: ${fields.join(", ")}`,
		// 		});
		// })();

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
