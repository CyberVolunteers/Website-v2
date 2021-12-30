import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";

import { faHandsHelping } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";

import CommunityCard from "./CommunityCard";

export default function IdeaShowcase() {
	return (
		<>
			{/* how it works */}

			<div className="how-it-works-section">
				<h1 className="bold">How it works</h1>
				<p style={{ fontWeight: "bold", fontSize: "18px" }}>
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
							<h3 className="bold">Make an Account</h3>
							<p>Create your personal account to connect with charities.</p>
						</div>
					</div>
					<div className="step">
						<div className="space-8"></div>

						<img className="icon-48" alt="" src="/img/mag_glass_icon.svg"></img>

						<div className="space-8"></div>

						<div className="presentation">
							<h3 className="bold">Find an Opportunity</h3>
							<p>
								Browse our opportunities and find a charity to volunteer for.
							</p>
						</div>
					</div>
					<div className="step">
						<img className="icon-64" alt="" src="/img/mail_icon.svg"></img>
						<div className="presentation">
							<h3 className="bold">Register your interest</h3>
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
							<h3 className="bold">Volunteer</h3>
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
						title="Emma Williams"
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
				<h1>
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

			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<span className="find-opportunity-button">
					<Link href="/charitySignup">Get Started</Link>
				</span>
			</div>

			{/* image area */}

			{/* <div className="image-wrapper" style={{ margin: "4rem auto" }}>
					<img src="/img/student.jpg" style={{ width: "100%" }} />
				</div> */}
		</>
	);
}
