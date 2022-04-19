import React, { ReactElement } from "react";
import Button from "../client/components/Button";
import Head from "../client/components/Head";
import { contactEmail } from "../serverAndClient/staticDetails";
import styles from "../client/styles/simplePage.module.css";
import { useRouter } from "next/router";

export default function CreatorCredits(): ReactElement {
	const router = useRouter();
	return (
		<div>
			<Head title="Creator credits - cybervolunteers" />

			<meta name="robots" content="noindex" />

			<div className={styles.container}>
				<h1 className={styles.main_heading}>Creators:</h1>
				<p className={styles.main_para}>
					<ul>
						<li>Co-founder: Finley Braund</li>
						<li>
							Some react, css and the backend:{" "}
							<a href="https://github.com/micnekr">micnekr</a>
						</li>
						<li>
							Some react, css and js:{" "}
							<a href="https://github.com/AtifWeb">Atif Asim</a>
						</li>
						<li>Page worth of html and css: Unknown name</li>
					</ul>
				</p>
				<Button onClick={() => router.back()} style={{ width: 220 }}>
					GO BACK
				</Button>
			</div>
		</div>
	);
}
