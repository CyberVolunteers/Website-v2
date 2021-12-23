import Mail from "nodemailer/lib/mailer";
import { v4 as uuidv4 } from "uuid";
import { protocolAndHost } from "../../serverAndClient/staticDetails";
import { sendEmail } from "./nodemailer";
import { addTempKey, RedisUUIDStores } from "./redis";

import confirmEmailTemplate from "./templates/confirmEmail";
import resetPasswordTemplate from "./templates/forgotPasswordEmail";

// https://www.geeksforgeeks.org/email-template-using-html-and-css/

/**
 * Inserts a uuid into the email template and sends it to an email address, remembering the uuid
 * @param email the email address to send the email to
 * @param getProps the callback that accepts the uuid and returns html and text to be used in the email
 * @param store the name of the store which will store the id in
 * @param data additional options to provide to nodemailer - can override things set by this method
 */
export async function sendEmailWithUUID(
	email: string,
	getProps: (uuid: string) => { html: string; text: string },
	store: RedisUUIDStores,
	data?: Mail.Options
) {
	const uuid = uuidv4();
	const { html, text } = getProps(uuid);
	// first do nodemailer so that it does not set uuids if it fails
	await sendEmail({
		to: email,
		text: text,
		html: html,
		...(data ?? {}),
	});
	await addTempKey(email, uuid, store);
}

export async function sendEmailConfirmationEmail(
	email: string,
	firstName: string,
	lastName: string
) {
	// current dir = /usr/app/.next/server/pages/api
	await sendEmailWithUUID(
		email,
		(uuid) => {
			const link = `${protocolAndHost}/confirmEmail?${new URLSearchParams({
				uuid,
				email,
			})}`;
			return {
				text: `Thanks for signing up, ${firstName} ${lastName}. Please verify your email address to get access to the charity listings by going to this web page: ${link}. If this was not done by you please ignore this email.`,
				html: confirmEmailTemplate(link, firstName, lastName),
			};
		},
		"emailConfirmUUID",
		{
			subject: "Please verify your email",
			attachments: [
				{
					filename: "logo.svg",
					path: `${__dirname}/../../../../public/img/logo.svg`,
					cid: "logo",
				},
			],
		}
	);
}

export async function sendPasswordResetEmail(
	email: string,
	firstName: string,
	lastName: string
) {
	// current dir = /usr/app/.next/server/pages
	await sendEmailWithUUID(
		email,
		(uuid) => {
			const link = `${protocolAndHost}/forgotPasswordWithToken?${new URLSearchParams(
				{
					uuid,
					email,
				}
			)}`;
			return {
				text: `Did you request a password reset, ${firstName} ${lastName}? Please only go to the following link if you requested the password reset: ${link}.`,
				html: resetPasswordTemplate(link, firstName, lastName),
			};
		},
		"passwordResetUUID",
		{
			subject: "Password reset",
			attachments: [
				{
					filename: "logo.svg",
					path: `${__dirname}/../../../public/img/logo.svg`,
					cid: "logo",
				},
			],
		}
	);
}
