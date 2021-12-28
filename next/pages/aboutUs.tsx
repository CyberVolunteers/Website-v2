import {
	faHandsHelping,
	faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactElement } from "react";
import CommunityCard from "../client/components/CommunityCard";
import Head from "../client/components/Head";

import styles from "../client/styles/aboutUs.module.css";

export default function AboutUs(): ReactElement {
	return (
		<div>
			<Head title="About us - cybervolunteers" />
			<div className={styles.header_image_container}>
				<h1 className={styles.header_text}>Connecting People with Purpose</h1>
				<img className={styles.header_image} src="/img/about-us-header.png" />
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

			<div className="how-it-works-section">
				<h1>How it works</h1>
				<p>
					Easily find volunteering opportunities on Cyber Volunteers to support
					causes that you care about and have a real impact.
				</p>

				<div className="steps-area">
					<div className="step">
						<div className="space-8"></div>

						<FontAwesomeIcon
							icon={faUserCircle}
							style={{
								marginBottom: "8px",
							}}
						/>

						<div className="presentation">
							<h3>Make an Account</h3>
							<p>Create your personal account to connect with charities.</p>
						</div>
					</div>
					<div className="step">
						<div className="space-8"></div>

						<img className="icon-48" alt="" src="/img/mag_glass_icon.svg"></img>

						<div className="space-8"></div>

						<div className="presentation">
							<h3>Find an Opportunity</h3>
							<p>
								Browse our opportunities and find a charity to volunteer for.
							</p>
						</div>
					</div>
					<div className="step">
						<img className="icon-64" alt="" src="/img/mail_icon.svg"></img>
						<div className="presentation">
							<h3>Register your interest</h3>
							<p>
								Simply click {`"Volunteer Now"`} to notify the charity of your
								interest.
							</p>
						</div>
					</div>
					<div className="step">
						<div className="space-8"></div>
						<FontAwesomeIcon
							icon={faHandsHelping}
							style={{
								marginBottom: "8px",
							}}
						/>

						<div className="presentation">
							<h3>Volunteer</h3>
							<p>
								Volunteer and help support meaningful causes you care about.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Community Area */}

			<div
				className="community-section"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<h1
					style={{ textAlign: "center", color: "#4D4D4D" }}
					className="landing-heading bold"
				>
					What our volunteering community thinks
				</h1>

				<div className="community-cards-wrapper">
					<CommunityCard
						text="Being able to find local opportunities this easily makes the process so much quicker and means I can spend more time actually volunteering."
						img_src="/img/headshot1.png"
						title="Elijah Taylor"
						subtitle="Volunteer"
					/>
					<CommunityCard
						text="Being able to find causes I care about has allowed me to engage more with my community and have more of an impact."
						img_src="/img/headshot2.png"
						title="Elijah Taylor"
						subtitle="Volunteer"
					/>
				</div>

				<h1
					style={{ marginTop: "30px", fontWeight: 400 }}
					className="make-loan-heading"
				>
					Volunteer now!
				</h1>
				<span className="find-opportunity-button">
					<Link href="/searchListings">Find an opportunity</Link>
				</span>
			</div>

			{/* volenteer area */}
			<div className="volenteer-area">
				<h1 className="bold">
					Cyber <br />
					Volunteer for nonprofits.
				</h1>

				<img src="/img/child1.jpg" />
			</div>

			<ul>
				<li>
					<div className="icon-wrapper">
						<img className="icon-64" src="/img/org_icon.svg" />
						<p>Create your {"organisation's"} profile.</p>
					</div>
				</li>
				<li>
					<div className="icon-wrapper">
						<img className="icon-64" src="/img/listings_icon.svg" />
						<p>Create volunteering opportunities.</p>
					</div>
				</li>
				<li>
					<div className="icon-wrapper">
						<img className="icon-64" src="/img/volunteers_icon.svg" />
						<p>Get connected to passionate volunteers.</p>
					</div>
				</li>
			</ul>

			{/* get started button */}

			<div className="button-wrapper">
				<a href="#">Get Started</a>
			</div>

			{/* image area */}

			{/* <div className="image-wrapper" style={{ margin: "4rem auto" }}>
					<img src="/img/student.jpg" style={{ width: "100%" }} />
				</div> */}
		</div>
	);
}
