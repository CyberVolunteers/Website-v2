import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import Button from "../client/components/Button";
import Head from "../client/components/Head";
import styles from "../client/styles/simplePage.module.css";

export default function Error404(): ReactElement {
	const router = useRouter();
	return (
		<div>
			<Head title="Not found - cybervolunteers" />

			<div className={styles.container}>
				<h1 className={styles.main_heading}>
					We are sorry, we {"couldn't"} find this page
				</h1>
				<p className={styles.main_para}>Maybe try double-checking the link?</p>
				<Button onClick={() => router.back()} style={{ width: 220 }}>
					GO BACK
				</Button>
			</div>
		</div>
	);
}
