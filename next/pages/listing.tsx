import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { ReactElement } from "react";

import Head from "../client/components/Head";
import styles from "../client/styles/listing.module.css";
import { useWindowSize } from "../client/utils/otherHooks";
import { Listing } from "../server/mongo/mongoModels";
import { getCleanListingData } from "../server/mongo/util";
import { ListingType } from "./searchListings";

import Button from "../client/components/Button";

import simplePageStyles from "../client/styles/simplePage.module.css";
import { capitalize } from "@material-ui/core";
import { getMongo } from "../server/mongo";

export default function ListingPage({
	listing,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const screenWidth = useWindowSize().width ?? 1000;
	const isSmallScreenVersion = screenWidth <= 768;
	// useViewProtection(["org", "user"]);

	if (listing === null)
		return (
			<div>
				<Head title="Listing not found - cybervolunteers" />

				<div className={simplePageStyles.container}>
					<h1 className={simplePageStyles.main_heading}>
						This listing could not be found
					</h1>
					<p className={simplePageStyles.main_para}>
						It is possible that it was deleted or the link was wrong.
					</p>
					<Button href="/searchListings" style={{ width: 220 }}>
						SEE ALL LISTINGS
					</Button>
				</div>
			</div>
		);

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
						{isSmallScreenVersion ? <InfoBox listing={listing} /> : null}
					</div>

					<div className={styles.row}>
						<div className={styles.container}>
							<div className={styles.row}>
								<p className={styles.paragraph}>
									{handleTextRender(listing.desc)}
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
								{handleTextRender(listing.requirements)}
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
									Available timings:
									<br />
									{handleTextRender(listing.time)}
									<br />
									Expected duration:
									<br />
									{handleTextRender(listing.duration)}
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
										{handleTextRender(listing.organisation.desc)}
									</p>
									{/* <a href="#" className={styles.link}>
										<button className={styles["Opportunities-button"]}>
											More Opportunities from Org
										</button>
									</a> */}
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
				{isSmallScreenVersion ? null : <InfoBox listing={listing} />}
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

function InfoBox({ listing }: { listing: ListingType }) {
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
						Available timings:
						<br />
						{handleTextRender(listing.time)}
						<br />
						Expected duration:
						<br />
						{handleTextRender(listing.duration)}
					</p>
					<h5 className={styles.h5}>Where</h5>
					<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
						{handleTextRender(
							listing.address1 + "\n" + (listing.address2 ?? "")
						)}
					</p>
					<h5 className={styles.h5}>Requirements</h5>
					<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
						{listing.maxHoursPerWeek === listing.minHoursPerWeek
							? `About ${listing.minHoursPerWeek} hours per week`
							: `${listing.minHoursPerWeek}-${listing.maxHoursPerWeek} hours per week`}{" "}
						to contribute to the cause
						<br />
						{handleTextRender(listing.requirements)}
					</p>
					<h5 className={styles.h5}>Good For</h5>
					<p className={`${styles.paragraph} ${styles["mon-text"]}`}>
						{handleTextRender(decodeTargetAudience(listing.targetAudience))}
					</p>
					<a href="#" className={`${styles["link"]}`}>
						<button className={`${styles["Opportunities-button2"]}`}>
							I want to help
						</button>
					</a>
					{/* <h5 className={styles.h52}>8 places left</h5> */}
				</div>
			</div>
		</div>
	);
}

function handleTextRender(text: string) {
	return (
		<>
			{capitalize(text)
				.replaceAll(/^(\n)+/g, "")
				.replaceAll(/(\n)+$/g, "")
				.replaceAll("<b>", "")
				.replaceAll("</b>", "")
				.split("\n")
				.map((t) => {
					// TODO: also do bold tags
					return (
						<>
							{t}
							<br />
						</>
					);
				})}
		</>
	);
}

function decodeTargetAudience(a: {
	under16: boolean;
	between16And18: boolean;
	between18And55: boolean;
	over55: boolean;
}): string {
	if (a.under16 && a.between16And18 && a.between18And55 && a.over55)
		return "All ages";
	if (!a.under16 && !a.between16And18 && !a.between18And55 && !a.over55)
		return "All ages";

	const ages: [number, number][] = [];
	if (a.under16) ages.push([0, 16]);
	if (a.between16And18) ages.push([16, 18]);
	if (a.between18And55) ages.push([18, 55]);
	if (a.over55) ages.push([55, 100]);

	let i = 0;

	while (i < ages.length - 1) {
		const [minAge1, maxAge1] = ages[i];
		const [minAge2, maxAge2] = ages[i + 1];
		console.log(minAge1, maxAge1, minAge2, maxAge2);
		// if we need to splice the ages, e.g. go from 16-18 and 18-55 to 18-55:
		if (maxAge1 === minAge2) {
			ages[i] = [minAge1, maxAge2];
			ages.splice(i + 1, 1);
		} else i++;
	}

	const ageStrings = ages.map(([minAge, maxAge]) => {
		if (minAge === 0) return `anyone up to ${maxAge} years old`;
		if (maxAge === 100) return `anyone older than ${minAge} years old`;
	});

	return ageStrings.join(" or ");
}

function duplicateStyle(cl: string) {
	return `${styles[cl]} ${cl}`;
}

export const getServerSideProps: GetServerSideProps<{
	listing: ListingType | null;
}> = async (context) => {
	const uuid = context.query.uuid;
	if (typeof uuid !== "string")
		return {
			props: {
				listing: null,
			},
		};

	await getMongo();

	const listing = await Listing.findOne({ uuid }).populate("organisation");
	if (listing === null)
		return {
			props: {
				listing: null,
			},
		};
	const processedListing: ListingType = getCleanListingData(listing);

	return {
		props: {
			listing: processedListing,
		}, // will be passed to the page component as props
	};
};
