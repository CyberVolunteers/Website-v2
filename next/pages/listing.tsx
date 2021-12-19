import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { style } from "@mui/system";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { ReactElement } from "react";

import Head from "../client/components/Head";
import styles from "../client/styles/listing.module.css";
import { useWindowSize } from "../client/utils/otherHooks";

export default function ListingPage({}: InferGetServerSidePropsType<
	typeof getServerSideProps
>): ReactElement {
	const screenWidth = useWindowSize().width ?? 1000;
	const isSmallScreenVersion = screenWidth <= 768;
	// useViewProtection(["org", "user"]);

	return (
		<>
			{/* TODO: add the title of the listing here  */}
			<Head title="Listing - cybervolunteers" />

			<div className={styles.page_container}>
				<div className={styles.content}>
					<div className={styles.container}>
						<div className={styles.row}>
							<h2
								className={styles["Opportunity-text"]}
								style={{ fontWeight: "bold !important" }}
							>
								Title of the Opportunity
							</h2>
							<h2
								className={styles["org-text"]}
								style={{ fontWeight: "bold !important" }}
							>
								Name of Org
							</h2>
							<img
								width="100%"
								className={styles["player-img"]}
								src="/img/listing-placeholder-image.jpg"
							/>
						</div>
						{isSmallScreenVersion ? <InfoBox /> : null}
					</div>

					<div className={styles.row}>
						<div className={styles.container}>
							<div className={styles.row}>
								<p className={styles.paragraph}>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud exercitation ullamco
									laboris nisi ut aliquip ex ea commodo consequat. Duis aute
									irure dolor in reprehenderit in voluptate velit esse cillum
									dolore eu fugiat nulla pariatur.
									<br />
									<br />
									Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud exercitation ullamco
									laboris nisi ut aliquip ex ea commodo consequat. Duis aute
									irure dolor in reprehenderit in voluptate velit esse cillum
									dolore eu fugiat nulla pariatur.
								</p>
							</div>
						</div>
						<div className={styles.gray_bg}></div>
					</div>

					<div className={styles.container}>
						<div className={styles.row}>
							<h2
								className={styles["Opportunity-text"]}
								style={{ fontWeight: "bold !important" }}
							>
								Requirements
							</h2>
							<p className={styles.paragraph}>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation ullamco laboris
								nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
								in reprehenderit in voluptate velit esse cillum dolore eu fugiat
								nulla pariatur.
							</p>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.container}>
							<div className={styles.row}>
								<h2
									className={styles["Opportunity-text"]}
									style={{ fontWeight: "bold !important" }}
								>
									When and time Commitments
								</h2>
								<p className={styles.paragraph}>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud exercitation ullamco
									laboris nisi ut aliquip ex ea commodo consequat. Duis aute
									irure dolor in reprehenderit in voluptate velit esse cillum
									dolore eu fugiat nulla pariatur.
								</p>
							</div>
						</div>
						<div className={styles.gray_bg}></div>
					</div>

					{/* <div className={styles.container}>
						<div className={styles.row}>
							<h2 className={styles["Opportunity-text"]}>
								Where the Opportunity is
							</h2>
							<br />
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18540.207568468537!2d-3.610813671498856!3d54.48894543498361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4863313ff232fc17%3A0xa0cf9a168926150!2sSt%20Bees%2C%20Saint%20Bees%2C%20UK!5e0!3m2!1sen!2s!4v1638394978184!5m2!1sen!2s"
								width="100%"
								height="400px"
								style={{ border: "0" }}
								allowFullScreen={true}
								loading="lazy"
							></iframe>
							<p className={styles.paragraph}>
								Cumbr/ia1st St Bees Scout GroupCA27 0DS
							</p>
						</div>
					</div> */}
					<div className={styles.row}>
						<div className={styles.container}>
							<div className={styles.row}>
								<div>
									<h2
										className={styles["Opportunity-text"]}
										style={{ fontWeight: "bold !important" }}
									>
										About Org
									</h2>
									<p className={styles.paragraph}>
										Lorem ipsum dolor sit amet, consectetur adipisicing elit,
										sed do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis nostrud exercitation
										ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit
										esse cillum dolore eu fugiat nulla pariatur.
										<br />
										<br />
										Lorem ipsum dolor sit amet, consectetur adipisicing elit,
										sed do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis nostrud exercitation
										ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit
										esse cillum dolore eu fugiat nulla pariatur.
									</p>
									<a href="#" className={styles.link}>
										<button className={styles["Opportunities-button"]}>
											More Opportunities from Org
										</button>
									</a>
								</div>
								<br />
								{/* <div className="w-100">
									<h5>Where they are</h5>
									<iframe
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18540.207568468537!2d-3.610813671498856!3d54.48894543498361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4863313ff232fc17%3A0xa0cf9a168926150!2sSt%20Bees%2C%20Saint%20Bees%2C%20UK!5e0!3m2!1sen!2s!4v1638394978184!5m2!1sen!2s"
										width="100%"
										height="400px"
										style={{ border: "0" }}
										allowFullScreen={true}
										loading="lazy"
									></iframe>
									<p className={styles.paragraph}>
										Cumbr/ia1st St Bees Scout GroupCA27 0DS
									</p>
								</div> */}
							</div>
						</div>
					</div>
				</div>
				{isSmallScreenVersion ? null : <InfoBox />}
			</div>
			<footer className={styles["footer-b"]}>
				<a href="#" className={styles.link}>
					<button className={styles["Opportunities-button3"]}>
						I want to help
					</button>
				</a>
			</footer>
		</>
	);
}

function InfoBox() {
	return (
		<div className={styles["info-box"]}>
			<div className={styles["fixed-f"]}>
				<div className={styles["icon-b"]}>
					<div className={`${styles.row} ${styles["icon-row"]}`}>
						<div className={styles.col}>
							<a href="#" className={`${styles.link} ${styles.facebook}`}>
								<img
									src="/img/cause0.svg"
									className={duplicateStyle("cause_icon")}
								/>
								<span>Group</span>
							</a>
							<a href="#" className={`${styles.link} ${styles.facebook}`}>
								<img
									src="/img/cause1.svg"
									className={duplicateStyle("cause_icon")}
								/>
								<span>Graduate</span>
							</a>
							<a href="#" className={`${styles.link} ${styles.facebook}`}>
								<img
									src="/img/cause2.svg"
									className={duplicateStyle("cause_icon")}
								/>
								<span>Leaf</span>
							</a>
						</div>
						<div className={styles.col}>
							<a
								href="#"
								className={`${styles.link} ${styles.facebook} ${styles["user-icon"]}`}
							>
								<FontAwesomeIcon icon={faHeart} />
								<span>Save to Favourites</span>
							</a>
						</div>
					</div>
					<h5 className={styles.h5}>When</h5>
					<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
						Mon 22 Nov, 2021 - Tue 23 Nov, 2021
						<br />
						09:15 AM - 03:15 PM
					</p>
					<h5 className={styles.h5}>Where</h5>
					<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
						This opportunity is virtual and has no fixed location
					</p>
					<h5 className={styles.h5}>Requirements</h5>
					<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
						2-8 hours per week
						<br />
						Driving License
						<br />
						Criminal Record Check
					</p>
					<h5 className={styles.h5}>Good For</h5>
					<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
						Kids, Teens, Groups size 6
					</p>
					<a href="#" className={`${styles["link"]}`}>
						<button className={`${styles["Opportunities-button2"]}`}>
							I want to help
						</button>
					</a>
					<h5 className={styles.h52}>8 places left</h5>
				</div>
			</div>
		</div>
	);
}

function duplicateStyle(cl: string) {
	return `${styles[cl]} ${cl}`;
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
	return {
		props: {}, // will be passed to the page component as props
	};
};
