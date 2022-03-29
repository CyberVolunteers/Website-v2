import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import Button from "../client/components/Button";
import Head from "../client/components/Head";
import styles from "../client/styles/simplePage.module.css";
import { getSession } from "../server/auth/auth-cookie";
import { isLoggedIn } from "../server/auth/data";
import { ExtendedNextApiRequest } from "../server/types";

function Welcome({
	email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	// TODO: fix the bug with viewProtection not detecting the correct user type (e.g. after a failed login)
	// TODO: fix flashing on viewProtection redirect
	// TODO: add view protection on the pages where applicable

	return (
		<div>
			<Head title="Registered to volunteer - cybervolunteers" />

			<div className={styles.container}>
				<h1 className={styles.main_heading}>
					You have been registered to volunteer successfully
				</h1>
				<p className={styles.main_para}>
					The organisation will contact you later if they have enough places
					left
				</p>
				<Button href="/searchListings" style={{ width: 220 }}>
					SEARCH FOR MORE LISTINGS
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
