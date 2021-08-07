import React, { useState } from "react";
import Card from "../client/components/Card";
import FeaturedCard from "../client/components/FeaturedCard";
import Pagination from "@material-ui/lab/Pagination";

import Image from "next/image";

import styles from "../client/styles/searchListings.module.css";
import { ReactElement } from "react";
import Head from "../client/components/Head";


export default function SearchListings(): ReactElement {
	const listingsPerPage = 6;

	const listings = [];

	for (let i = 0; i < 7; i++) {
		listings.push({
			uuid: "abcd-uuid-asafs",
			title: `<title> ${i}`,
			desc: "<desc>",
			organisationName: "<org name>",
			currentVolunteers: 4,
			requestedVolunteers: 10,
		});
	}

	const pagesNum = Math.ceil(listings.length / listingsPerPage);
	const [listingsPage, setListingsPage] = useState(0);

	return (<>
		<Head title="Search for listings - cybervolunteers" />

		<div className={`${styles["Home"]}`}>

			<div className={`${styles["top-area"]} dflex w-1000`}>
				<span className="w-100 dflex-align-center">
					<h1>Volunteer now</h1>
					<span className={`${styles["right-side"]}`}>
						<div className={`${styles["icon-container"]}`}>
							<Image
								src="/img/filter.svg"
								width={30}
								height={30}
								alt="Filter icon"
							/>
						</div>
						<p>Filter</p>
					</span>
				</span>
			</div >


			<div className={`${styles["featured-card-wrapper"]}`}>
				<h1 className="w-1000">Featured: Loans with research backed impact</h1>
				<p className="w-1000">{listings[0].title}</p>
				<FeaturedCard listing={listings[0]} img="/img/listing1.jpg" />
			</div>


			<div className={`${styles["cards-grid"]} w-1000`}>

				{
					listings.filter((val, index) => index >= listingsPage * listingsPerPage && index < (listingsPage + 1 * listingsPerPage)).map((value, index) => <Card key={index} img="/img/listing2.jpg" listing={value} />)
				}
			</div>


			<div className={`${styles["pagination-area"]} w-1000`}>
				<div className={`${styles["pages"]}`}>
					{/* because they start with 1 for some reason */}
					<Pagination count={pagesNum} page={listingsPage + 1} onChange={(event, value) => setListingsPage(value - 1)} />
				</div>
			</div>
		</div >
	</>
	);
}
