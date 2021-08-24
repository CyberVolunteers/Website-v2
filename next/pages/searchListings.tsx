import React, { useEffect, useState } from "react";
import Card from "../client/components/Card";
import FeaturedCard from "../client/components/FeaturedCard";
import Pagination from "@material-ui/lab/Pagination";

import Image from "next/image";

import styles from "../client/styles/searchListings.module.css";
import { ReactElement } from "react";
import Head from "../client/components/Head";
import { useRouter } from "next/dist/client/router";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { searchListingsSpec } from "../serverAndClient/publicFieldConstants";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { flatten, Flattened } from "combined-validator";
import { relativeDistanceSearchValue } from "../serverAndClient/staticDetails";

export default function SearchListings({
	fields,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactElement {
	const listingsPerPage = 6;

	const router = useRouter();

	const rawKeywords = router.query.keywords;
	const [keywords, setKeywords] = useState(undefined as string | undefined);
	// when the router updates, set the keywords
	useEffect(() => {
		if (router.isReady) {
			setKeywords(typeof rawKeywords !== "string" ? "" : rawKeywords);
		}
	}, [router]);

	const [location, setLocation] = useState("");
	const [minHours, setMinHours] = useState(0);
	const [maxHours, setMaxHours] = useState(10000); //TODO: set a max value
	const [onlineState, setOnlineState] = useState("any");
	const [category, setCategory] = useState((fields.category.enum as any[])[0]);
	const [listings, setListings] = useState([] as any[]);
	const [areExtraOptionsShown, setAreExtraOptionsShown] = useState(false);
	useEffect(() => {
		if (keywords === undefined) return; // make sure it is that specific update
		if (areExtraOptionsShown) return; // do not send requests when typing
		updateListings();
	}, [keywords]);

	const [overallErrors, setOverallErrors] = useState(
		{} as {
			[key: string]: string;
		}
	);

	// fetch
	async function updateListings() {
		setOverallErrors({});
		if (keywords === undefined) return; // do not fetch twice
		const queryObj = {
			keywords,
		} as { [key: string]: any };

		if (areExtraOptionsShown) {
			queryObj.minHours = "" + minHours;
			queryObj.maxHours = "" + maxHours;
			if (category.toLowerCase() !== "any") queryObj.category = category;
			if (location !== "") queryObj.targetLoc = "" + location;
			if (onlineState !== "any") queryObj.isOnline = onlineState === "online";
		}
		const res = await fetch(
			`/api/searchListings?${new URLSearchParams(queryObj)}`,
			{
				method: "GET",
				headers: {
					"content-type": "application/json",
					accept: "application/json",
				},
			}
		);
		if (
			!(await updateOverallErrorsForRequests(
				res,
				"searchListingsRequest",
				overallErrors,
				setOverallErrors
			))
		)
			return;

		const { listings: receivedData, distances } = (await res.json()) as {
			listings: any[];
			distances: {
				distance: number;
				uuid: string;
			}[];
		};

		// Find an overall score

		// for efficient decoding
		const processedDistanceMap = Object.fromEntries(
			distances.map((l) => [l.uuid, Math.log(l.distance)])
		);

		const valuesWithTextScores = receivedData.filter(
			(v) => v.textScore !== undefined
		); // don't check if there are values with text score through "keywords" because of race conditions

		function average(arr: any[], getVal: (v: any) => number) {
			return (
				arr.reduce((v1, v2, i) => (i === 0 ? 0 : getVal(v1)) + getVal(v2), 0) /
				arr.length
			);
		}

		const textScoreBase =
			valuesWithTextScores.length === 0
				? 1 // the value doesn't matter in this case
				: average(valuesWithTextScores, (v) => v.textScore);

		const processedDistances = Object.values(processedDistanceMap);

		const distanceScoreBase =
			processedDistances.length === 0
				? 1
				: average(processedDistances, (d) => d);

		receivedData.forEach((v) => {
			v.score = 0;
			if (v.textScore !== undefined) v.score += v.textScore / textScoreBase;
			if (processedDistanceMap[v.uuid] !== undefined)
				v.score +=
					(relativeDistanceSearchValue * processedDistanceMap[v.uuid]) /
					distanceScoreBase;
		});

		// sort them
		receivedData.sort((a, b) => b.score - a.score);
		setListings(receivedData);
	}

	const pagesNum = Math.ceil(listings.length / listingsPerPage);
	const [listingsPage, setListingsPage] = useState(0);

	return (
		<>
			<Head title="Search for listings - cybervolunteers" />

			<div className={`${styles["Home"]}`}>
				<div className={`${styles["top-area"]} dflex w-1000`}>
					<span className="w-100 dflex-align-center">
						<h1>Volunteer now</h1>
						<span
							className={`${styles["right-side"]}`}
							onClick={() => setAreExtraOptionsShown(!areExtraOptionsShown)}
						>
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
				</div>

				{Object.entries(overallErrors).map(([k, v]) => (
					<h1 key={k}>{v}</h1>
				))}

				{/* Extra search options */}
				{!areExtraOptionsShown ? null : (
					<div>
						<p>
							{`I am sorry for this horrendous mess. Anyways, Advanced search
							options"`}
						</p>
						<form
							onSubmit={(evt) => {
								evt.preventDefault();
								updateListings();
							}}
						>
							<label htmlFor="loc">
								Prioritize listings near this location (leave empty for any
								location)
							</label>
							<input
								id="loc"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
							></input>
							<label htmlFor="minH">Min hours</label>
							<input
								id="minH"
								type="number"
								value={minHours}
								onChange={(e) => setMinHours(parseInt(e.target.value))}
							></input>
							<label htmlFor="maxH">Max hours</label>
							<input
								id="maxH"
								type="number"
								value={maxHours}
								onChange={(e) => setMaxHours(parseInt(e.target.value))}
							></input>
							<label htmlFor="keywords">Cause type</label>
							<select
								id="category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							>
								{(fields.category.enum as any[]).map((o, i) => (
									<option key={i} value={o}>
										{o}
									</option>
								))}
							</select>
							<label htmlFor="keywords">Keywords</label>
							<input
								id="keywords"
								value={keywords}
								onChange={(e) => setKeywords(e.target.value)}
							></input>
							<label htmlFor="onlineState">Is it online?</label>
							<select
								id="onlineState"
								value={onlineState}
								onChange={(e) => setOnlineState(e.target.value)}
							>
								<option value="any">Any</option>
								<option value="online">Online only</option>
								<option value="offline">In-person only</option>
							</select>
							<button type="submit">Submit!</button>
						</form>
					</div>
				)}
				{keywords === "" && !areExtraOptionsShown && listings.length > 0 ? ( // only show when showing everything
					<div className={`${styles["featured-card-wrapper"]}`}>
						<h1 className="w-1000">Featured:</h1>
						<p className="w-1000">{listings[0].title}</p>
						<FeaturedCard {...listings[0]} />
					</div>
				) : null}
				<div className={`${styles["cards-grid"]} w-1000`}>
					{listings
						.filter(
							(val, index) =>
								index >= listingsPage * listingsPerPage &&
								index < listingsPage + 1 * listingsPerPage
						)
						.map((value, index) => (
							<Card key={index} {...value} />
						))}
				</div>
				{listings.length === 0 ? (
					<p>We could not find anything that matched your search query</p>
				) : null}
				<div className={`${styles["pagination-area"]} w-1000`}>
					{pagesNum > 1 ? (
						<div className={`${styles["pages"]}`}>
							{/* because they start counting from 1 for some reason */}
							<Pagination
								count={pagesNum}
								page={listingsPage + 1}
								onChange={(event, value) => setListingsPage(value - 1)}
							/>
						</div>
					) : null}
				</div>
			</div>
		</>
	);
}

export const getStaticProps: GetStaticProps<{
	fields: Flattened;
}> = async () => {
	return {
		props: {
			fields: flatten(searchListingsSpec),
		},
	};
};
