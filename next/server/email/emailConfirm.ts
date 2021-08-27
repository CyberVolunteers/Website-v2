import { sendEmailWithUUID } from ".";
import { protocolAndHost } from "../../serverAndClient/staticDetails";

export async function sendEmailConfirmationEmail(email: string) {
	await sendEmailWithUUID(
		email,
		(uuid) => {
			const link = `${protocolAndHost}/confirmEmail?${new URLSearchParams({ uuid, email })}`;
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
