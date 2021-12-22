import React from "react";
import Button from "./Button";
import styles from "../styles/signOut.module.css";
import { useRouter } from "next/router";
import { csrfFetch } from "../utils/csrf";
import { updateLoginState } from "../utils/userState";
export const SignOut = ({ csrfToken }: { csrfToken: string }) => {
	const router = useRouter();
	return (
		<div className={styles.SignOut}>
			<h2 className={styles.sub_heading}>Sign Out</h2>
			<div className={styles.buttonWrapper}>
				<Button
					style={{
						backgroundColor: "transparent",
						color: "#333",
						borderColor: "#484848",
					}}
					outline={true}
					onClick={async () => {
						// TODO: maybe have an ability to show an error?
						await csrfFetch(csrfToken, "/api/logout", {
							method: "POST",
							credentials: "same-origin", // only send cookies for same-origin requests
							headers: {
								"content-type": "application/json",
								accept: "application/json",
							},
						});

						updateLoginState();

						router.push("/");
					}}
				>
					Sign Out
				</Button>
			</div>
		</div>
	);
};
