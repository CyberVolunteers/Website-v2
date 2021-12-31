import {
	faHandsHelping,
	faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactElement } from "react";
import CommunityCard from "../client/components/CommunityCard";
import Head from "../client/components/Head";
import IdeaShowcase from "../client/components/IdeaShowcase";

import styles from "../client/styles/aboutUs.module.css";

export default function AboutUs(): ReactElement {
	return (
		<div>
			<Head title="About us - cybervolunteers" />
			<div className={styles.header_image_container}>
				<h1 className={styles.header_text}>Connecting People with Purpose</h1>
				<img
					style={{
						height: "100vh",
						objectFit: "cover",
					}}
					className={styles.header_image}
					src="/img/about-us-header.png"
				/>
			</div>
			<div className={styles.desc_block}>
				<p className={styles.desc}>
					Our mission at Cyber Volunteers is to empower people to get involved
					with meaningful community causes and enable charities to do
					extraordinary work by connecting them with passionate volunteers.
					Through our platform, we aim to provide people with life-changing
					opportunities and to connect communities and people with purpose.
				</p>
				<p className={styles.desc}>
					Cyber Volunteers was created because of the difficulties people face
					in finding ways to volunteer, and because too often young people are
					forgotten about. So we started Cyber Volunteers, which aims to allow
					everyone to volunteer and gain valuable skills.
				</p>
			</div>
			<h3 className={`${styles.subsection_header} bold`}>
				Thanks to the Organisations Helping to Build Community with Cyber
				Volunteers
			</h3>

			<img className={styles.partners_logos} src="/img/supporter_logos.png" />

			<IdeaShowcase />
		</div>
	);
}
