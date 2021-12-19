import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import Button from "../client/components/Button";
import Head from "../client/components/Head";
import styles from "../client/styles/welcome.module.css";
import { useViewProtection } from "../client/utils/otherHooks";
import { getSession } from "../server/auth/auth-cookie";
import { isLoggedIn } from "../server/auth/data";
import { ExtendedNextApiRequest } from "../server/types";

function Welcome({
	email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	// TODO: fix the bug with viewProtection not detecting the correct user type (e.g. after a failed login)
	// TODO: fix flashing on viewProtection redirect
	// useViewProtection(["unverified_org", "unverified_user"]);
	return (
		<div>
			<Head title="Welcome - cybervolunteers" />

			<div className={styles.container}>
				<h1 className={styles.main_heading}>Welcome to Cyber Volunteers</h1>
				<p className={styles.main_para}>
					You have created a Cyber Volunteers account. A verification email has
					been sent to {email ?? "your email address"}
					{/*TODO: test if this works*/}. Please verify your email to be able to
					sign up for volunteering opportunities.
				</p>
				<Button href="/myAccount" style={{ width: 220 }}>
					GO TO MY ACCOUNT
				</Button>
			</div>
		</div>
	);
}

export default Welcome;

export const getServerSideProps: GetServerSideProps<{
	email: string | null;
}> = async (context: any) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);

	return {
		props: {
			email: isLoggedIn(session) && session !== null ? session.email : null,
		}, // will be passed to the page component as props
	};
};
