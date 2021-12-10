import { ReactElement } from "react";
import Head from "../client/components/Head";
import IndexCard from "../client/components/IndexCard";
import CommunityCard from "../client/components/CommunityCard";

import Link from "next/link";

import { HandleSliderMovement } from "../client/js/HandleSliderMovement";
import { useIsAfterRehydration } from "../client/utils/otherHooks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSurprise } from "@fortawesome/free-regular-svg-icons";

import {
	faDollarSign,
	faHandsHelping,
	faSearch,
} from "@fortawesome/free-solid-svg-icons";

export default function Home(): ReactElement {
	if (useIsAfterRehydration()) HandleSliderMovement();
	return (
		<div>
			<Head title="Cybervolunteers" />

			<div className="main-page">
				{/* Video Section */}
				<div className="video-section">
					<video
						src="/video/cybervolunteers-intro.mp4"
						autoPlay
						muted
						controls
						style={{ width: "100%" }}
					></video>
					<div className="presentation">
						<h1 className="main-heading">
							Connecting people
							<span className="main-heading-span">with purpose</span>
						</h1>
						<span className="first-section-button">
							<Link href="#">Find an opportunity</Link>
						</span>
					</div>
				</div>

				{/* Support Case */}

				<div className="support-case-section">
					<h1 style={{ textAlign: "center", color: "#4D4D4D" }}>
						Support Causes you care about
					</h1>
					<div className="top-navigation-area">
						<div className="icon-wrapper disable left">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="23"
								height="23"
								viewBox="0 0 202.23 391.319"
							>
								<path
									id="Path_64095"
									data-name="Path 64095"
									d="M271.456,383.791l157.3-194.7,44.921,44.927L353.863,383.808,473.686,533.619l-44.944,46.795Z"
									transform="translate(-271.456 -189.095)"
									fill="#fff"
								/>
							</svg>
						</div>
						<div className="reel-wrapper">
							<div className="reel first-reel reel-h3">
								<h3 className="active reel-h3" id="top-nav-1">
									Community
								</h3>
								<h3 className="reel-h3" id="top-nav-2">
									Covid 19
								</h3>
								<h3 className="reel-h3" id="top-nav-3">
									Education
								</h3>
								<h3 className="reel-h3" id="top-nav-4">
									Healthcare
								</h3>
								<h3 className="reel-h3" id="top-nav-5">
									Refugees
								</h3>
								<h3 className="reel-h3" id="top-nav-6">
									Refugees
								</h3>
								<h3 className="reel-h3" id="top-nav-7">
									Refugees
								</h3>
								<h3 className="reel-h3" id="top-nav-8">
									Refugees
								</h3>
								<h3 className="reel-h3" id="top-nav-9">
									Refugees
								</h3>
								<h3 className="reel-h3" id="top-nav-10">
									Refugees
								</h3>
							</div>
						</div>

						<div className="icon-wrapper right">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="23"
								height="23"
								viewBox="0 0 202.23 391.319"
							>
								<path
									id="Path_64095"
									data-name="Path 64095"
									d="M271.456,383.791l157.3-194.7,44.921,44.927L353.863,383.808,473.686,533.619l-44.944,46.795Z"
									transform="translate(-271.456 -189.095)"
									fill="#fff"
								/>
							</svg>
						</div>
					</div>

					<div
						className="request-navigation-area "
						style={{ margin: "2rem auto" }}
					>
						<div className="icon-wrapper disable left">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="23"
								height="23"
								viewBox="0 0 202.23 391.319"
							>
								<path
									id="Path_64095"
									data-name="Path 64095"
									d="M271.456,383.791l157.3-194.7,44.921,44.927L353.863,383.808,473.686,533.619l-44.944,46.795Z"
									transform="translate(-271.456 -189.095)"
									fill="#fff"
								/>
							</svg>
						</div>

						<div className="reel-wrapper">
							<div className="reel second-reel">
								<div className="cards-wrap ">
									<IndexCard
										img="/img/placeholder1.jpg"
										title="Miguel Antonio"
										subtitle="only 47 minutes left"
										desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine."
										meternow="20"
										totalgo="120"
									/>
									<IndexCard
										img="/img/placeholder1.jpg"
										title="Miguel Antonio"
										subtitle="only 47 minutes left"
										desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine."
										meternow="20"
										totalgo="120"
									/>
									<IndexCard
										img="/img/placeholder1.jpg"
										title="Miguel Antonio"
										subtitle="only 47 minutes left"
										desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine."
										meternow="20"
										totalgo="120"
									/>
								</div>

								<div className="cards-wrap">
									<IndexCard
										img="/img/placeholder1.jpg"
										title="Miguel Antonio"
										subtitle="only 47 minutes left"
										desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine."
										meternow="20"
										totalgo="120"
									/>
									<IndexCard
										img="/img/placeholder1.jpg"
										title="Miguel Antonio"
										subtitle="only 47 minutes left"
										desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine."
										meternow="20"
										totalgo="120"
									/>
									<IndexCard
										img="/img/placeholder1.jpg"
										title="Miguel Antonio"
										subtitle="only 47 minutes left"
										desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine."
										meternow="20"
										totalgo="120"
									/>
								</div>

								<div className="cards-wrap ">
									<IndexCard
										img="/img/placeholder1.jpg"
										title="Miguel Antonio"
										subtitle="only 47 minutes left"
										desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine."
										meternow="20"
										totalgo="120"
									/>
									<IndexCard
										img="/img/placeholder1.jpg"
										title="Miguel Antonio"
										subtitle="only 47 minutes left"
										desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine."
										meternow="20"
										totalgo="120"
									/>
									<div
										className="card-wrapper link-box"
										style={{ padding: "3rem 1.5rem" }}
									>
										<Link
											// TODO: do this
											// style={{
											// 	boxShadow:
											// 		"0 0.65rem 0.875rem 0.4375rem rgb(153 153 153 / 10%)",
											// 	borderRadius: "10px",
											// }}
											href="#"
										>
											View all loans to women
										</Link>
									</div>
								</div>
							</div>
						</div>
						<div className="icon-wrapper right">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="23"
								height="23"
								viewBox="0 0 202.23 391.319"
							>
								<path
									id="Path_64095"
									data-name="Path 64095"
									d="M271.456,383.791l157.3-194.7,44.921,44.927L353.863,383.808,473.686,533.619l-44.944,46.795Z"
									transform="translate(-271.456 -189.095)"
									fill="#fff"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* how it works */}

				<div className="how-it-works-section">
					<h1>How it works</h1>
					<p>
						Easily find volunteering opportunities on Cyber Volunteers to
						support causes that you care about and have a real impact.
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

							<img
								className="icon-48"
								alt=""
								src="/img/mag_glass_icon.svg"
							></img>

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
									Simply click "Volunteer Now" to notify the charity of your
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
						className="landing-heading"
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
						<Link href="#">Find an opportunity</Link>
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
							<p>Create your organisation's profile.</p>
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
		</div>
	);
}
