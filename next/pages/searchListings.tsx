import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import Head from "../client/components/Head";

import FeaturedCard from "../client/components/FeaturedCard";

import Link from "next/link";
import Card from "../client/components/Card";

import styles from "../client/styles/searchListings.module.css";

type Listing = {
	imagePath: string;
	title: string;
	organisationName: string;
	desc: string;
	uuid: string;
};

const MAX_LISTINGS_PER_PAGE = 6;

function SearchListings() {
	const listings: Listing[] = [
		{
			imagePath: "/img/cad.jpg",
			title: "TITLE",
			organisationName: "ORG NAME",
			desc: "DESC and a bunch of words A loan of $7,700 helps a member who is going to stock up with bundles of used clothing, which will build up her working capital.",
			uuid: "3",
		},
	];

	for (let i = 0; i < 6; i++) {
		listings.push(...listings);
	}

	const pagesNum = Math.ceil(listings.length / MAX_LISTINGS_PER_PAGE);
	const [selectedPage, setSelectedPage] = useState(2);

	const featuredListing: Listing | undefined = listings[0];

	return (
		<div className="Home">
			<Head title="Cybervolunteers" />

			<div
				style={{ display: "flex", alignItems: "center" }}
				className={`${styles["top-area"]} dflex w-1000`}
			>
				<div className="left-side">
					{/* <small>
						<span>All Loans</span> Eco-friendly
					</small> */}
					<h1 style={{ fontWeight: "bold", fontSize: "2rem" }}>Eco-friendly</h1>
					{/* <p>
						Protecting the environment and creating economic growth don’t always
						go hand in hand, but by supporting these loans you give people
						access to products that reduce pollution and provide sustainable
						energy, and support businesses that promote recycling.
					</p> */}
				</div>
				<div className={`${styles["right-side"]} dflex-align-center`}>
					{/* <div className="explore dflex-align-center">
						<Link href="#">
							<>
								<ExploreOutlinedIcon />
								<p>Explore</p>
							</>
						</Link>
					</div> */}

					<div
						className={`${styles["filter-button-container"]} dflex-align-center`}
					>
						<Link href="#">
							<>
								<img className={styles["filter-img"]} src={"/img/filter.svg"} />
								<p>Filter</p>
							</>
						</Link>
					</div>
				</div>
			</div>

			<div className={styles["featured-card-wrapper"]}>
				<h1 className="w-1000">
					Featured: Volunteering Opportunity in {"<category>"}
				</h1>
				<p className="w-1000">TITLE</p>
				<FeaturedCard
					imagePath="/img/cad.jpg"
					title="TITLE"
					organisationName="ORG NAME"
					desc="DESC and a bunch of words A loan of $7,700 helps a member who is going to stock up with bundles of used clothing, which will build up her working capital."
					uuid="3"
				/>
			</div>

			<div className={`${styles["cards-grid"]} w-1000`}>
				{(() => {
					const out = [];
					const listingsBefore = selectedPage * MAX_LISTINGS_PER_PAGE;
					for (
						let i = listingsBefore;
						i <
						Math.min(listings.length, listingsBefore + MAX_LISTINGS_PER_PAGE);
						i++
					) {
						const listing = listings[i];
						out.push(
							<Card
								key={i}
								imagePath={listing.imagePath}
								title={listing.title}
								organisationName={listing.organisationName}
								desc={listing.desc}
								uuid={listing.uuid}
							/>
						);
					}
					return out;
				})()}
			</div>

			<div className={`${styles["pagination-area"]} w-1000`}>
				<img
					src="/img/arrowLeft.svg"
					onClick={() => setSelectedPage(Math.max(selectedPage - 1, 0))}
				></img>

				<div className={styles.pages}>
					<span
						className={`${styles.number} ${
							selectedPage === 0 ? styles.select : ""
						}`}
						onClick={() => setSelectedPage(0)}
					>
						1
					</span>
					{selectedPage >= 3 ? (
						<>
							<span>.</span>
							<span>.</span>
							<span>.</span>
						</>
					) : null}

					{spanIfInRange(
						selectedPage,
						1,
						pagesNum,
						selectedPage,
						setSelectedPage
					)}
					{spanIfInRange(
						selectedPage + 1,
						1,
						pagesNum,
						selectedPage,
						setSelectedPage
					)}
					{spanIfInRange(
						selectedPage + 2,
						1,
						pagesNum,
						selectedPage,
						setSelectedPage
					)}

					{selectedPage <= pagesNum - 3 ? (
						<>
							<span>.</span>
							<span>.</span>
							<span>.</span>
						</>
					) : null}

					<span
						className={`${styles.number} ${
							selectedPage === pagesNum - 1 ? styles.select : ""
						}`}
						onClick={() => setSelectedPage(pagesNum - 1)}
					>
						{pagesNum}
					</span>
				</div>
				<img
					src="/img/arrowRight.svg"
					onClick={() =>
						setSelectedPage(Math.min(selectedPage + 1, pagesNum - 1))
					}
				></img>
			</div>
		</div>
	);
}

function spanIfInRange(
	val: number,
	min: number,
	max: number,
	selectedPage: number,
	setSelectedPage: Dispatch<SetStateAction<number>>
): null | ReactElement {
	if (min < val && val < max)
		return (
			<span
				className={`${styles.number} ${
					selectedPage === val - 1 ? styles.select : ""
				}`}
				onClick={() => setSelectedPage(val - 1)}
			>
				{val}
			</span>
		);
	else return null;
}

export default SearchListings;
