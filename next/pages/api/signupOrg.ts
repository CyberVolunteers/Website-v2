// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
	createHandler,
	ajv,
	verifyJSONShape,
	runMiddleware,
} from "../../server/apiRequests";
import { createAjvJTDSchema } from "combined-validator";
import {
	emailLengthField,
	longField,
	mediumField,
	organisations,
} from "../../serverAndClient/publicFieldConstants";
import { signupOrg, verifyOrgData } from "../../server/auth/data";
import { HandlerCollection, MulterReq } from "../../server/types";
import { logger } from "../../server/logger";
import { sendEmail } from "../../server/email/nodemailer";
import {
	allowedFileTypes,
	notificationsEmail,
} from "../../serverAndClient/staticDetails";
import { doAllRulesApply } from "../../server/validation";
import {
	clearServerSideSession,
	updateSession,
} from "../../server/auth/auth-cookie";
import multer from "multer";
import { getFileExtension } from "../../serverAndClient/utils";

export const config = {
	api: {
		bodyParser: false,
	},
};
type Data = {
	name: string;
};

const logoStorage = multer.memoryStorage();

const upload = multer({
	storage: logoStorage,
	limits: {
		fields: 40,
		fileSize: 512 * 1024 * 1024,
		files: 1,
	},
});

const bodyParser = ajv.compileParser(
	createAjvJTDSchema({
		required: {
			string: {
				orgName: { maxLength: mediumField },
				orgType: { maxLength: mediumField },

				addressLine1: { maxLength: mediumField },
				addressLine2: { maxLength: mediumField },
				websiteUrl: { maxLength: mediumField },
				city: { maxLength: mediumField },
				phone: { maxLength: mediumField },
				postcode: { maxLength: mediumField },

				orgDescription: { maxLength: longField },
				orgMission: { maxLength: longField },
				isForUnder18: { maxLength: 7 },
				safeguardingLeadEmail: { maxLength: emailLengthField },
				safeguardingLeadName: { maxLength: mediumField },
				safeguardingPolicyLink: { maxLength: mediumField },
				trainingTypeExplanation: { maxLength: mediumField },

				twitterLink: { maxLength: mediumField },
				facebookLink: { maxLength: mediumField },
				linkedinLink: { maxLength: mediumField },

				email: { maxLength: emailLengthField },
				firstName: { maxLength: mediumField },
				lastName: { maxLength: mediumField },
				password: { maxLength: mediumField },
			},
		},
	})
);

const handlers: HandlerCollection = {
	// TODO: check if some of the fields are empty strings
	POST: async function (req: MulterReq, res) {
		await runMiddleware(req, res, upload.single("logoFile") as any);

		// make sure that we do not process the file as a part of json data
		if (typeof req.body === "object" && req.body !== null)
			delete req.body.logoFile;

		const file = req.file;
		if (file === undefined)
			return res
				.status(400)
				.send("We could not receive an image file for your logo");

		//IMPORTANT: do not forget to check the json shape as well
		if (verifyJSONShape(req, res, bodyParser) === false) return;

		const fileExt = getFileExtension(file.originalname);
		if (fileExt === null || !allowedFileTypes.includes(fileExt))
			return res.status(400).send("Please upload a valid image file");

		if (!verifyOrgData(req.body)) {
			logger.info("server.signupOrg:Invalid data on signup: %s", req.body);
			return res.status(400).send("Please supply valid data");
		}

		const isForUnder18 = req.body.isForUnder18 === "true";

		// make sure that the safeguarding is filled in properly
		const under18RequiredFields = [
			"safeguardingPolicyLink",
			"safeguardingLeadName",
			"safeguardingLeadEmail",
		];
		const under18OptionalFields = ["trainingTypeExplanation"];
		if (isForUnder18) {
			under18OptionalFields.forEach((f) => {
				if (req.body[f] === "") delete req.body[f];
			});

			if (under18RequiredFields.some((f) => req.body.f === ""))
				return res.status(400).send("Please supply valid safeguarding data");
		} else {
			under18RequiredFields
				.concat(under18OptionalFields)
				.forEach((f) => delete req.body[f]);
		}

		const optionalFields = ["twitterLink", "facebookLink", "linkedinLink"];

		// make sure that the rest is filled in properly
		if (
			Object.values(req.body).some((v) => {
				typeof v !== "string" || (!optionalFields.includes(v) && v === "");
			})
		) {
			logger.info("server.signupOrg:Data missing on signup: %s", req.body);
			return res
				.status(400)
				.send(
					"We did not receive all your data. Please contact us as it is likely to be a bug with the website"
				);
		}

		const signupResult = await signupOrg(
			{ ...req.body, isForUnder18 },
			fileExt,
			file.buffer
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
		clearServerSideSession(req);
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
			allowFiles: true,
		},
		{ POST: bodyParser }
	)(req, res);
}
