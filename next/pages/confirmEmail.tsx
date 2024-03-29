import Head from "../client/components/Head";
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
import Button from "../client/components/Button";

import styles from "../client/styles/simplePage.module.css";
import { logger } from "../server/logger";

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
				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						Your email has been verified successfully.
					</h1>
					<Button
						href="/searchListings"
						style={{ width: 220, marginTop: "2rem", marginBottom: "2rem" }}
					>
						SEARCH LISTINGS
					</Button>
					<h4>
						Note: if you are using this account on a different device or
						browser, you would have to log out and back in on those pages for
						this to take effect
					</h4>
				</div>
			) : (
				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						Something went wrong when verifying your email.
					</h1>
					<p className={styles.main_para}>
						It is possible that this is because the link you used is too old.
						Please try again.
					</p>

					<h4>For your security, only the last sent email is valid.</h4>
				</div>
			)}
		</div>
	);
}
export const getServerSideProps: GetServerSideProps<{
	isSuccessful: boolean;
}> = async (context) => {
	const { uuid, email } = context.query;
	if (typeof uuid !== "string" || typeof email !== "string") {
		logger.error(
			"server.confirmEmail: Invalid uuid or email: '%s' '%s', query: '%s'",
			uuid,
			email,
			context.query
		);
		return {
			props: {
				isSuccessful: false,
			},
		};
	}
	logger.warn(
		"Confirming email; the uuid is %s and the email is %s, query: %s",
		uuid,
		email,
		context.query
	);

	let isSuccessful = await verifyUUID(email, uuid, "emailConfirmUUID");
	if (!isSuccessful)
		return {
			props: {
				isSuccessful: false,
			},
		};

	// NOTE: we are not destroying the UUID so that the subsequent visits to the page do not show an error.

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
