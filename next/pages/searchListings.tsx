import React, { useEffect, useState } from "react";
import Card from "../client/components/Card";
import FeaturedCard from "../client/components/FeaturedCard";
import Pagination from "@material-ui/lab/Pagination";

import Image from "next/image";

import styles from "../client/styles/searchListings.module.css";
import { ReactElement } from "react";
import Head from "../client/components/Head";
import { useRouter } from "next/dist/client/router";
import SimpleForm from "../client/components/SimpleForm";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { searchListingsSpec } from "../serverAndClient/publicFieldConstants";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { flatten, Flattened } from "combined-validator";
import { searchListingsSpecNamesToShow } from "../serverAndClient/displayNames";


export default function SearchListings({ fields }: InferGetStaticPropsType<typeof getStaticProps>): ReactElement {
	const listingsPerPage = 6;

	const router = useRouter();

	const rawKeywords = router.query.keywords;
	const [keywords, setKeywords] = useState(undefined as string | undefined);
	// when the router updates, set the keywords
	useEffect(() => {
		if (router.isReady) {
			setKeywords(typeof rawKeywords !== "string" ? "" : rawKeywords)

		}
	}, [router]);


	const [isAfterInitialUpdate, setIsAfterInitialUpdate] = useState(false);
	const [location, setLocation] = useState("");
	const [minHours, setMinHours] = useState(0);
	const [maxHours, setMaxHours] = useState(10); //TODO: set a max value
	const [category, setCategory] = useState(null);
	useEffect(() => {
		if (isAfterInitialUpdate || keywords === undefined) return; // make sure it is that specific update
		updateListings();
		console.log("updating", keywords)
		setIsAfterInitialUpdate(true);
	}, [keywords])


	const [listings, setListings] = useState([] as any[]);
	const [areExtraOptionsShown, setAreExtraOptionsShown] = useState(false);
	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

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
		if (!await updateOverallErrorsForRequests(res, "searchListingsRequest", overallErrors, setOverallErrors)) return;

		const receivedData = await res.json() as any[];
		receivedData.sort((a, b) => b.score - a.score) // sort them
		setListings(receivedData);
	}

	const pagesNum = Math.ceil(listings.length / listingsPerPage);
	const [listingsPage, setListingsPage] = useState(0);

	return (<>
		<Head title="Search for listings - cybervolunteers" />

		<div className={`${styles["Home"]}`}>

			<div className={`${styles["top-area"]} dflex w-1000`}>
				<span className="w-100 dflex-align-center">
					<h1>Volunteer now</h1>
					<span className={`${styles["right-side"]}`} onClick={() => setAreExtraOptionsShown(!areExtraOptionsShown)}>
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

			{/* Extra search options */}
			{
				!areExtraOptionsShown ? null :
					<div>
						<p>I am sorry for this horrendous mess. Anyways, "Advanced search options"</p>
						<form onSubmit={(evt) => {
							evt.preventDefault();
							updateListings()
						}}>
							<label htmlFor="keywords">Keywords</label>
							<input id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)}></input>
							<label htmlFor="loc">Search near this location</label>
							<input id="loc" value={location} onChange={e => setLocation(e.target.value)}></input>
							<label htmlFor="minH">Keywords</label>
							<input id="minH" type="number" value={minHours} onChange={e => setMinHours(e.target.value)}></input>
							<label htmlFor="keywords">Keywords</label>
							<button type="submit">Submit!</button>
						</form>
					</div>
			}

			{
				keywords === "" && listings.length > 0 ? // only show when showing everything
					<div className={`${styles["featured-card-wrapper"]}`}>
						<h1 className="w-1000">Featured: Loans with research backed impact</h1>
						<p className="w-1000">{listings[0].title}</p>
						<FeaturedCard {...listings[0]} />
					</div>
					: null
			}


			<div className={`${styles["cards-grid"]} w-1000`}>

				{
					listings.filter((val, index) => index >= listingsPage * listingsPerPage && index < (listingsPage + 1 * listingsPerPage)).map((value, index) => <Card key={index} {...value} />)
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

export const getStaticProps: GetStaticProps<{
	fields: Flattened
}> = async () => {
	return {
		props: {
			fields: flatten(searchListingsSpec)
		}
	}
}