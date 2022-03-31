import { GetStaticProps, InferGetStaticPropsType } from "next";
import React, { ReactElement } from "react";
import Button from "../client/components/Button";
import Head from "../client/components/Head";
import { contactEmail } from "../serverAndClient/staticDetails";
import styles from "../client/styles/simplePage.module.css";
import { useRouter } from "next/router";

export default function Error500(): ReactElement {
	const router = useRouter();
	return (
		<div>
			<Head title="Server error - cybervolunteers" />

			<div className={styles.container}>
				<h1 className={styles.main_heading}>
					We are sorry, something went wrong{" "}
				</h1>
				<p className={styles.main_para}>
					Please email us at {contactEmail} and tell us what led to this issue
				</p>
				<Button onClick={() => router.back()} style={{ width: 220 }}>
					GO BACK
				</Button>
			</div>
		</div>
	);
}
