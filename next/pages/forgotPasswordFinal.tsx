import Head from "../client/components/Head";
import Link from "next/link";
import {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextApiResponse,
} from "next";
import { updateLoginState, useViewerType } from "../client/utils/userState";
import { destroyUUID, verifyUUID } from "../server/email/redis";
import { setEmailAsVerified } from "../server/auth/data";
import { getMongo } from "../server/mongo";
import { updateSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { ReactElement } from "react";
import Button from "../client/components/Button";

import styles from "../client/styles/simplePage.module.css";
import { useRouter } from "next/router";
import { useIsAfterRehydration } from "../client/utils/otherHooks";

export default function EmailConfirmationEmailSent({}): ReactElement {
	const router = useRouter();
	const isSuccessful = router.query.isSuccessful === "true";
	const viewerType = useViewerType();
	const isAfterRehydration = useIsAfterRehydration();
	if (viewerType !== "server") updateLoginState();

	if (!isAfterRehydration)
		return (
			<>
				<Head title="Password reset - cybervolunteers" />
			</>
		);
	return (
		<div>
			<Head
				title={`${
					isSuccessful ? "Password reset successfully" : "Password reset failed"
				} - cybervolunteers`}
			/>

			{isSuccessful ? (
				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						Your password has been reset successfully.
					</h1>
					{/* <p className={styles.main_para}>
						Feel free to */}
					{/* tweak{" "}
						<Link href="/myAccount" passHref>
							<a>your account</a>
						</Link>{" "}
						or to{" "} */}
					{/* </p> */}
					<Button
						href="/searchListings"
						style={{ width: 220, marginTop: "2rem", marginBottom: "2rem" }}
					>
						SEARCH LISTINGS
					</Button>
				</div>
			) : (
				<div className={styles.container}>
					<h1 className={styles.main_heading}>
						Something went wrong when resetting your password.
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
