import React, { useEffect, useState } from "react";
import Card from "../client/components/Card";
import FeaturedCard from "../client/components/FeaturedCard";
import Pagination from "@material-ui/lab/Pagination";

import Image from "next/image";

import styles from "../client/styles/searchListings.module.css";
import { ReactElement } from "react";
import Head from "../client/components/Head";
import { useRouter } from "next/dist/client/router";
import { Flattened } from "combined-validator";


export default function SearchListings(): ReactElement {
	const router = useRouter();

	const rawKeywords = router.query.keywords;
	const [keywords, setKeywords] = useState(undefined as string | undefined);
	// when the router updates, set the keywords
	useEffect(() => { if (router.isReady) setKeywords(typeof rawKeywords !== "string" ? "" : rawKeywords) }, [router]);


	const listingsPerPage = 6;

	const [listings, setListings] = useState([] as any[]);

	// fetch
	async function updateListings() {
		if (keywords === undefined) return; // do not fetch twice

		const res = await fetch(`/api/searchListings?${new URLSearchParams({
			keywords
		})}`, {
			method: "GET",
			headers: {
				"content-type": "application/json",
				"accept": "application/json",
			},
		});
		// TODO: add an error message somewhere here
		const receivedData = await res.json() as any[];
		receivedData.sort((a, b) => b.score - a.score) // sort them
		setListings(receivedData);
	}

	useEffect(() => { updateListings() }, [keywords]) // only run once on rehydration

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

			{
				keywords === "" && listings.length > 0 ? // only show when showing everything
					<div className={`${styles["featured-card-wrapper"]}`}>
						<h1 className="w-1000">Featured: Loans with research backed impact</h1>
						<p className="w-1000">{listings[0].title}</p>
						<FeaturedCard listing={listings[0]} img="/img/listing1.jpg" />
					</div>
					: null
			}


			<div className={`${styles["cards-grid"]} w-1000`}>

				{
					listings.filter((val, index) => index >= listingsPage * listingsPerPage && index < (listingsPage + 1 * listingsPerPage)).map((value, index) => <Card key={index} img="/img/listing2.jpg" {...value} />)
				}
			</div>

			{
				listings.length === 0 ? 
				<p>We could not find anything that matched your search query</p>
				: null
			}


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
