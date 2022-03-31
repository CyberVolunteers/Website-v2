import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";
import Button from "../client/components/Button";
import Head from "../client/components/Head";
import styles from "../client/styles/simplePage.module.css";
import { useViewProtection } from "../client/utils/otherHooks";
import { createSessionOutOfData, getSession } from "../server/auth/auth-cookie";
import {
	getUserType,
	isLoggedIn,
	manipulateDataByEmail,
} from "../server/auth/data";
import { sendEmailConfirmationEmail } from "../server/email";
import { ExtendedNextApiRequest } from "../server/types";
import { contactEmail } from "../serverAndClient/staticDetails";

function SendEmailConfirmationEmail({
	email,
	isOrg,
	isVerifiedAlready,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	if (isVerifiedAlready)
		return (
			<div>
				<Head title="Confirm your email - cybervolunteers" />

				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						Your email has been verified already
					</h1>
					<p className={styles.main_para}>Feel free to use the website!</p>
					<Button href="/myAccount" style={{ width: 220 }}>
						GO TO MY ACCOUNT
					</Button>
				</div>
			</div>
		);
	if (email === null)
		return (
			<div>
				<Head title="Confirm your email - cybervolunteers" />

				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						Something went wrong and we could not find your email.
					</h1>
					<p className={styles.main_para}>
						Please contact us at {contactEmail}.
					</p>
				</div>
			</div>
		);
	return (
		<div>
			<Head title="Confirm your email - cybervolunteers" />

			<div className={styles.container}>
				<h1 className={styles.main_heading}>Please confirm your email</h1>
				<p className={styles.main_para}>
					A verification email has been sent to {email}. Please verify your
					email to{" "}
					{isOrg
						? "continue creating your Organisation's Cyber Volunteers profile."
						: "be able to sign up for volunteering opportunities."}
				</p>
				<Button href="/myAccount" style={{ width: 220 }}>
					GO TO MY ACCOUNT
				</Button>
			</div>
		</div>
	);
}

export default SendEmailConfirmationEmail;

export const getServerSideProps: GetServerSideProps<{
	email: string | null;
	isOrg: boolean;
	isVerifiedAlready: boolean;
}> = async (context: any) => {
	let session = await getSession(context.req as ExtendedNextApiRequest);
	if (session === null && typeof context.query.email === "string")
		session = createSessionOutOfData(
			await manipulateDataByEmail(context.query.email)
		);

	if (typeof session !== "object" || session === null)
		return {
			props: {
				email: null,
				isOrg: false,
				isVerifiedAlready: false,
			},
		};

	if (session.isEmailVerified === true)
		return {
			props: {
				email: null,
				isOrg: false,
				isVerifiedAlready: true,
			},
		};

	const email = session.email;
	const firstName = session.firstName;
	const lastName = session.lastName;

	if ([email, firstName, lastName].some((f) => typeof f !== "string"))
		return {
			props: {
				email: null,
				isOrg: false,
				isVerifiedAlready: false,
			},
		};

	await sendEmailConfirmationEmail(email, firstName, lastName);

	return {
		props: {
			email: session.email,
			isOrg: session.isOrg,
			isVerifiedAlready: false,
		}, // will be passed to the page component as props
	};
};
