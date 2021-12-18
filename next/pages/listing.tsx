import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { style } from "@mui/system";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { ReactElement } from "react";

import Head from "../client/components/Head";
import styles from "../client/styles/listing.module.css";

export default function ListingPage({}: InferGetServerSidePropsType<
	typeof getServerSideProps
>): ReactElement {
	// useViewProtection(["org", "user"]);

	return (
		<>
			{/* TODO: add the title of the listing here  */}
			<Head title="Listing - cybervolunteers" />

			<div className={duplicateStyle("container")}>
				<div className={`${duplicateStyle("row")} reverse`}>
					<div className={duplicateStyle("col-md-6")}>
						<h2 className={styles["Opportunity-text"]}>
							Title of the Opportunity
						</h2>
						<h2 className={styles["org-text"]}>Name of Org</h2>
						<img
							width="100%"
							className={styles["player-img"]}
							src="/img/listing-placeholder-image.jpg"
						/>
					</div>
					<div className={duplicateStyle("col-md-6")}>
						<div className={styles["info-box"]}>
							<div className={styles["fixed-f"]}>
								<div className={styles["icon-b"]}>
									<div
										className={`${duplicateStyle("row")} ${styles["icon-row"]}`}
									>
										<div className={duplicateStyle("col")}>
											<a
												href="#"
												className={`${styles.link} ${styles.facebook}`}
											>
												<img src="/img/cause0.svg" className="cause_icon" />
												<span>Group</span>
											</a>
											<a
												href="#"
												className={`${styles.link} ${styles.facebook}`}
											>
												<img src="/img/cause1.svg" className="cause_icon" />
												<span>Graduate</span>
											</a>
											<a
												href="#"
												className={`${styles.link} ${styles.facebook}`}
											>
												<img src="/img/cause2.svg" className="cause_icon" />
												<span>Leaf</span>
											</a>
										</div>
										<div className={duplicateStyle("col")}>
											<a
												href="#"
												className={`${styles.link} ${styles.facebook} ${styles["user-icon"]}`}
											>
												<FontAwesomeIcon icon={faHeart} />
												<span>Save to Favourites</span>
											</a>
										</div>
									</div>
									<h5 className={duplicateStyle("h5")}>When</h5>
									<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
										Mon 22 Nov, 2021 - Tue 23 Nov, 2021
										<br />
										09:15 AM - 03:15 PM
									</p>
									<h5 className={duplicateStyle("h5")}>Where</h5>
									<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
										This opportunity is virtual and has no fixed location
									</p>
									<h5 className={duplicateStyle("h5")}>Requirements</h5>
									<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
										2-8 hours per week
										<br />
										Driving License
										<br />
										Criminal Record Check
									</p>
									<h5 className={duplicateStyle("h5")}>Good For</h5>
									<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
										Kids, Teens, Groups size 6
									</p>
									<a href="#" className={`${styles["link"]}`}>
										<button className={`${styles["Opportunities-button2"]}`}>
											I want to help
										</button>
									</a>
									<h5 className={duplicateStyle("h52")}>8 places left</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={`${duplicateStyle("row")} ${styles["gray-bg"]}`}>
				<div className={duplicateStyle("container")}>
					<div className={duplicateStyle("row")}>
						<div className={duplicateStyle("col-md-6")}>
							<p className={styles.paragraph}>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation ullamco laboris
								nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
								in reprehenderit in voluptate velit esse cillum dolore eu fugiat
								nulla pariatur.
								<br />
								<br />
								Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation ullamco laboris
								nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
								in reprehenderit in voluptate velit esse cillum dolore eu fugiat
								nulla pariatur.
							</p>
						</div>
						<div className={duplicateStyle("col-md-6")}></div>
					</div>
				</div>
			</div>

			<div className={duplicateStyle("container")}>
				<div className={duplicateStyle("row")}>
					<div className={duplicateStyle("col-md-6")}>
						<h2 className={duplicateStyle("Opportunity-text")}>Requirements</h2>
						<p className={styles.paragraph}>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur.
						</p>
					</div>
					<div className={duplicateStyle("col-md-6")}></div>
				</div>
			</div>
			<div className={`${duplicateStyle("row")} styles["gray-bg"]`}>
				<div className={duplicateStyle("container")}>
					<div className={duplicateStyle("row")}>
						<div className={duplicateStyle("col-md-6")}>
							<h2 className={styles["Opportunity-text"]}>
								When and time Commitments
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
						<div className={duplicateStyle("col-md-6")}></div>
					</div>
				</div>
			</div>

			<div className={duplicateStyle("container")}>
				<div className={duplicateStyle("row")}>
					<div className={duplicateStyle("col-md-6")}>
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
					<div className={duplicateStyle("col-md-6")}></div>
				</div>
			</div>
			<div className={`${duplicateStyle("row")} styles["gray-bg"]`}>
				<div className={duplicateStyle("container")}>
					<div className={duplicateStyle("row")}>
						<div className={duplicateStyle("col-md-6")}>
							<h2 className={styles["Opportunity-text"]}>About Org</h2>
							<p className={styles.paragraph}>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation ullamco laboris
								nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
								in reprehenderit in voluptate velit esse cillum dolore eu fugiat
								nulla pariatur.
								<br />
								<br />
								Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation ullamco laboris
								nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
								in reprehenderit in voluptate velit esse cillum dolore eu fugiat
								nulla pariatur.
							</p>
							<a href="#" className={styles.link}>
								<button className={styles["Opportunities-button"]}>
									More Opportunities from Org
								</button>
							</a>
							<br />
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
						</div>
						<div className={duplicateStyle("col-md-6")}></div>
					</div>
				</div>
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

function duplicateStyle(cl: string) {
	return `${styles[cl]} ${cl}`;
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
	return {
		props: {}, // will be passed to the page component as props
	};
};
