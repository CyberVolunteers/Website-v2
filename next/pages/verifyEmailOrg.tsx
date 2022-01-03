import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";
import Button from "../client/components/Button";
import Head from "../client/components/Head";
import styles from "../client/styles/simplePage.module.css";
import { getSession } from "../server/auth/auth-cookie";
import { isLoggedIn } from "../server/auth/data";
import { ExtendedNextApiRequest } from "../server/types";

export default function WelcomeOrg() {
	const router = useRouter();
	const _email = router.query.email;
	const email = typeof _email === "string" ? _email : null;
	// TODO: do this
	// useViewProtection(["unverified_org", "unverified_user"]);
	return (
		<div>
			<Head title="Verify your email - cybervolunteers" />

			<div className={styles.container}>
				<h1 className={styles.main_heading}>Please verify your email</h1>
				<p className={styles.main_para}>
					A verification email has been sent to {email ?? "your email address"}.
					Please verify your email to continue creating your Organisation’s
					Cyber Volunteers profile.
				</p>
				<Button onClick={() => {}} style={{ width: 220 }}>
					RESEND THE EMAIL
				</Button>
			</div>
		</div>
	);
}
