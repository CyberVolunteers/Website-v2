import Mail from "nodemailer/lib/mailer";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "./nodemailer";
import { addTempKey, RedisStores } from "./redis";

export async function sendEmailWithUUID(
	email: string,
	getProps: (uuid: string) => {html: string, text: string},
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
