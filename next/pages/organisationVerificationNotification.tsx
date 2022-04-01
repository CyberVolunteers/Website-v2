import React, { ReactElement } from "react";
import Button from "../client/components/Button";
import Head from "../client/components/Head";
import styles from "../client/styles/simplePage.module.css";

export default function OrganisationVerificationNotification(): ReactElement {
	return (
		<div>
			<Head title="Charity confirmation - cybervolunteers" />

			<div className={styles.container}>
				<h1 className={styles.main_heading}>
					Thank you for signing your Organisation up on Cyber Volunteers
				</h1>
				<p className={styles.main_para}>
					We aim to review all organisation submissions within 72 hours. Once we
					have made a decision you will either receive an email confirming your
					organisation has been granted an account or inquiring about further
					information
				</p>
				<Button href="/" style={{ width: 220 }}>
					CONTINUE
				</Button>
			</div>
		</div>
	);
}
