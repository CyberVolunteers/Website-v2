import Head from "../client/components/Head";
import Link from "next/link";
import {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextApiResponse,
} from "next";
import { updateLoginState, useViewerType } from "../client/utils/userState";
import { verifyUUID } from "../server/email/redis";
import { setEmailAsVerified } from "../server/auth/data";
import { getMongo } from "../server/mongo";
import { updateSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { ReactElement } from "react";

export default function EmailConfirmationEmailSent({
	isSuccessful,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const viewerType = useViewerType();
	if (viewerType !== "server") updateLoginState();
	return (
		<div>
			<Head
				title={`${
					isSuccessful
						? "Email verified successfully"
						: "Email verification failed"
				} - cybervolunteers`}
			/>

			{isSuccessful ? (
				<>
					<h1>Your email has been verified successfully.</h1>
					<div>
						Feel free to
						{/* tweak{" "}
						<Link href="/myAccount" passHref>
							<a>your account</a>
						</Link>{" "}
						or to{" "} */}
						<Link href="/searchListings" passHref>
							<a>look at some listings</a>
						</Link>
					</div>
					<h4>
						Note: if you are using this account on a different device or
						browser, you would have to log out and back in on those pages for
						this to take effect
					</h4>
				</>
			) : (
				<>
					<h1>Something went wrong when verifying your email.</h1>
					<h3>
						It is possible that this is because the link you used is too old.
						Please try again
					</h3>
					<h3>For your security, only the last sent email is valid</h3>
				</>
			)}
		</div>
	);
}
export const getServerSideProps: GetServerSideProps<{
	isSuccessful: boolean;
}> = async (context) => {
	const { uuid, email } = context.query;
	if (typeof uuid !== "string" || typeof email !== "string")
		return {
			props: {
				isSuccessful: false,
			},
		};

	let isSuccessful = await verifyUUID(email, uuid, "emailConfirmUUID");

	// connect mongo
	//TODO: somehow make it impossible to miss this?
	await getMongo();

	// set the values
	const resultDoc = await setEmailAsVerified(email);

	// if belongs to a user, set the new session
	if (resultDoc !== null)
		await updateSession(
			context.req as ExtendedNextApiRequest,
			context.res as NextApiResponse,
			resultDoc
		);
	else isSuccessful = false; // the user was not found

	return {
		props: {
			isSuccessful,
		}, // will be passed to the page component as props
	};
};
