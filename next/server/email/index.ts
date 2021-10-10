import Mail from "nodemailer/lib/mailer";
import { v4 as uuidv4 } from "uuid";
import { protocolAndHost } from "../../serverAndClient/staticDetails";
import { sendEmail } from "./nodemailer";
import { addTempKey, RedisStores } from "./redis";

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
	store: RedisStores,
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


export async function sendEmailConfirmationEmail(email: string) {
	await sendEmailWithUUID(
		email,
		(uuid) => {
			const link = `${protocolAndHost}/confirmEmail?${new URLSearchParams({
				uuid,
				email,
			})}`;
			return {
				text: `Go to this link: ${link}`,
				html: `<h1>Please register:</h1> <p><a href="${link}">go</a> </p> <p> or if that does not work, visit this link: ${link}`,
			};
		},
		"emailConfirmUUID",
		{
			subject: "Please verify your email.",
		}
	);
}