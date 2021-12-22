import React from "react";
import styles from "../styles/password.module.css";
import Link from "next/link";

export const Password = () => {
	return (
		<div className={styles.BasicInfo} id="Password">
			<h2 className={styles.heading_2}>Password</h2>
			<p className={styles.smallpara}>
				If you wish to change your password click ‘change password’. You will
				then be prompted enter your current password before you can change your
				password . If you have forgotten your password then click ‘forgot
				password’ and an email will be sent to your email account with
				instructions on how to reset your password.
			</p>
			<Link href="changePassword">
				<div className={styles.link}>
					<p>••••••••</p>

					<p>
						Change Password <i className="fas fa-angle-right"></i>
					</p>
				</div>
			</Link>
		</div>
	);
};
