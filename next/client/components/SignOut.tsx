import React from "react";
import Button from "./Button";
import styles from "../styles/signOut.module.css";
export const SignOut = () => {
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
				>
					Sign Out
				</Button>
			</div>
		</div>
	);
};
