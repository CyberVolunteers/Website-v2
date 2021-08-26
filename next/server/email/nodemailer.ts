import { createTransport } from "nodemailer";

import * as aws from "@aws-sdk/client-ses";
import { defaultSenderEmail } from "./config";
import Mail from "nodemailer/lib/mailer";
const ses = new aws.SES({
	region: "us-east-2",
	apiVersion: "2010-12-01",
});

let transporter = createTransport({
	SES: { ses, aws },
	sendingRate: 1,
});

export async function sendEmail(data: Mail.Options){
	await transporter.sendMail({
		from: defaultSenderEmail,
		...data,
	});
}