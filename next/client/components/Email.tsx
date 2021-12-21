import React from "react";
import styles from "../styles/email.module.css";
import Link from "next/link";

export const Email = ({ email }: { email: string }) => {
	return (
		<div className={styles.BasicInfo} id="Email">
			<h2 className={styles.heading_2}>Email</h2>
			<p className={styles.smallpara}>
				If you wish to change your email address please click ‘change email’.
				You will then be prompted to enter your current password before you can
				change your email address. Once you have changed your email address a
				verification email will be sent to your new email address.
			</p>
			<div className={styles.link}>
				<Link href="#">
					<>
						<p>{email}</p>

						<p>
							Change Email <i className="fas fa-angle-right"></i>
						</p>
					</>
				</Link>
			</div>
		</div>
	);
};
