import React, {
	Dispatch,
	ReactElement,
	ReactNode,
	RefObject,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Head from "../client/components/Head";

import FeaturedCard from "../client/components/FeaturedCard";

import Card from "../client/components/Card";

import styles from "../client/styles/searchListings.module.css";
import { categoryNames } from "../client/utils/const";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import PlusIcon from "@material-ui/icons/Add";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Listing } from "../server/mongo/mongoModels";
import { getMongo } from "../server/mongo";
import { getCleanListingData } from "../server/mongo/util";
import { wait } from "../client/utils/misc";
import { useRouter } from "next/router";
import { useWindowSize } from "../client/utils/otherHooks";

const minLocationSearchCooldownMillis = 500;

type OrgType = {
	contactEmails: string[];
	isOrganisationVerified: boolean;
	hasSafeguarding: boolean;
	listings: []; // TODO: change that somehow?
	type: string;
	name: string;
	desc: string;
	location: string;
	phoneNumber: string;
	creds: {
		email: string;
		passwordHash: string;
	};
};
export type ListingType = {
	duration: string;
	time: string;
	skills: string;
	requirements: string;
	title: string;
	desc: string;
	categories: string[];
	// requiredData: {
	// 	enum: Object.keys(flatten(users)).filter((k) => k !== "password"),
	// 	array: true,
	// },
	imagePath: string;
	uuid: string;
	targetAudience: {
		under16: boolean;
		between16And18: boolean;
		between18And55: boolean;
		over55: boolean;
	};
	isFlexible: boolean;
	minHoursPerWeek: number;
	maxHoursPerWeek: number;
	requestedNumVolunteers: number;
	currentNumVolunteers: number;
	organisation: OrgType;

	scrapedOrgName?: string;

	address1: string;
	address2?: string;
};

const MAX_LISTINGS_PER_PAGE = 6;

const preventEvent = (e: {
	preventDefault: () => void;
	stopPropagation: () => void;
}) => {
	e.preventDefault();
	e.stopPropagation();
};

function SearchListings({
	listings: _listings,
	maxHours,
	minHours,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const screenWidth = useWindowSize()?.width;
	const isMobile = !!screenWidth && screenWidth < 770;

	const router = useRouter();

	const queryKeywords: null | string =
		typeof router.query.keywords === "string" ? router.query.keywords : null;

	const [errorMessage, setErrorMessage] = useState("");
	const [warningMessage, setWarningMessage] = useState("");

	const [listings, setListings] = useState(_listings);
	const pagesNum = Math.ceil(listings.length / MAX_LISTINGS_PER_PAGE);

	const [selectedPage, setSelectedPage] = useState(0);
	const [showFilter, setShowFilter] = useState(queryKeywords !== null);

	const [categories, setCategories] = useState([] as string[]);
	const [keywords, setKeywords] = useState([] as string[]);
	const [location, setLocation] = useState("");
	const [hoursRange, setHoursRange] = useState(
		null as null | [number, number] | "flexible"
	);

	const [areHoursFlexible, setAreHoursFlexible] = useState(false);

	useEffect(() => {
		if (queryKeywords === null) return;
		setShowFilter(true);
		setKeywords([queryKeywords]);
	}, [queryKeywords]);

	const featuredListing: ListingType | undefined = !showFilter
		? listings.find((l) => l.title === "Home from Hospital Volunteers")
		: undefined;

	useEffect(() => {
		setCategories([]);
		setKeywords([]);
		setLocation("");
		setHoursRange(null);

		setShowFilter(false);
		setListings(_listings);
		setSelectedPage(0);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) return;
		if (!showFilter) {
			setListings(_listings);
			setSelectedPage(0);
		} else {
			submit();
		}
	}, [showFilter]);

	useEffect(() => {
		(async () => {
			const thisUpdatorId = Math.random();
			window.lastAddressSuggestionsUpdatorId = thisUpdatorId;

			if (location.length <= 4) return;

			await wait(minLocationSearchCooldownMillis);
			// if there have been no more requests, proceed
			if (window.lastAddressSuggestionsUpdatorId !== thisUpdatorId) return;
			submit();
		})();
	}, [location]);

	useEffect(() => {
		submit();
	}, [categories, keywords, areHoursFlexible]);

	useEffect(() => {
		if (hoursRange === null) submit();
	}, [hoursRange]);

	async function submit() {
		if (isMobile) return;
		if (!showFilter) return;
		const query: {
			location?: string;
			keywords?: string[];
			categories?: string[];
			minHours?: number;
			maxHours?: number;
			isFlexible?: boolean;
		} = {};

		if (hoursRange !== null) {
			if (hoursRange === "flexible") query.isFlexible = true;
			else {
				query.minHours = hoursRange[0];
				query.maxHours = hoursRange[1];
			}
		}

		if (categories.length > 0) query.categories = categories;
		if (keywords.length > 0) query.keywords = keywords;
		if (location !== "") query.location = location;

		const res = await fetch("/api/searchListings", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(query),
		});

		// TODO: have an error message there
		if (res.status >= 400) return setErrorMessage(await res.text());

		// TODO: show a warning if could not find the place

		const resData = await res.json();

		if (!resData.couldLocationBeUsed && location !== "")
			setWarningMessage("We are sorry, we could not recognize that place");
		else setWarningMessage("");
		const newListings = resData.results
			.map((lData: any) => {
				let l = _listings.find((l) => l.uuid === lData.uuid);
				if (l === undefined) return null;
				l = { ...l, ...lData };
				return l;
			})
			.filter((l: any) => l !== null);

		newListings.sort((e1: any, e2: any) => e2.score - e1.score);

		setListings(newListings);

		setSelectedPage(0);
	}

	return (
		<div className="Home" style={{ overflow: "hidden" }}>
			<Head title="Volunteer - cybervolunteers" />

			<div
				style={{ display: "flex", alignItems: "center" }}
				className={`${styles["top-area"]} dflex w-1000`}
			>
				<div className="left-side">
					{/* <small>
						<span>All Loans</span> Eco-friendly
					</small> */}
					<h1 className="bold" style={{ fontSize: "2rem" }}>
						Volunteer now
					</h1>
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

					{isMobile ? null : (
						<div
							className={`${styles["filter-button-container"]} dflex-align-center`}
							style={{ cursor: "pointer" }}
							onClick={() => setShowFilter(!showFilter)}
						>
							<img className={styles["filter-img"]} src={"/img/filter.svg"} />
							<p>Filter</p>
						</div>
					)}
				</div>
			</div>

			<div className={styles["main-content"]}>
				{!isMobile && showFilter ? (
					<Filter
						onConfirm={submit}
						minHours={minHours}
						maxHours={maxHours}
						{...{
							categories,
							setCategories,
							location,
							setLocation,
							hoursRange,
							setHoursRange,
							keywords,
							setKeywords,
							areHoursFlexible,
							setAreHoursFlexible,
						}}
					/>
				) : null}
				<span
					className="helping-text login-helper"
					style={{
						display: errorMessage === "" ? "none" : "inline-block",
					}}
				>
					{errorMessage}
				</span>
				<span
					className="helping-text login-helper"
					style={{
						display: warningMessage === "" ? "none" : "inline-block",
					}}
				>
					{warningMessage}
				</span>
				{featuredListing === undefined ? null : (
					<div className={styles["featured-card-wrapper"]}>
						<h1 className="w-1000 bold">
							Featured: Volunteering Opportunity in{" "}
							{featuredListing.categories[0]}
						</h1>
						<p className="w-1000">{featuredListing.title}</p>
						<FeaturedCard
							imagePath={featuredListing.imagePath}
							title={featuredListing.title}
							organisationName={
								featuredListing.scrapedOrgName ??
								featuredListing.organisation.name
							}
							desc={featuredListing.desc}
							uuid={featuredListing.uuid}
						/>
					</div>
				)}

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
									organisationName={
										listing.scrapedOrgName ?? listing.organisation.name
									}
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
						className={styles.pagination_arrow}
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
						{pagesNum <= 2 ? null : (
							<>
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

								{selectedPage <= pagesNum - 4 ? (
									<>
										<span>.</span>
										<span>.</span>
										<span>.</span>
									</>
								) : null}
							</>
						)}

						{pagesNum <= 1 ? null : (
							<span
								className={`${styles.number} ${
									selectedPage === pagesNum - 1 ? styles.select : ""
								}`}
								onClick={() => setSelectedPage(pagesNum - 1)}
							>
								{pagesNum}
							</span>
						)}
					</div>
					<img
						className={styles.pagination_arrow}
						src="/img/arrowRight.svg"
						onClick={() =>
							setSelectedPage(
								Math.max(0, Math.min(selectedPage + 1, pagesNum - 1))
							)
						}
					></img>
				</div>
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

function CustomDropdown({
	title,
	children,
}: {
	title: ReactNode;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const selfRef: RefObject<HTMLDivElement> = useRef(null);

	function handleClickOutside(evt: MouseEvent) {
		if (selfRef.current && !selfRef.current.contains(evt.target as Node)) {
			setIsOpen(false);
		}
	}

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		// unmount code
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div tabIndex={0} ref={selfRef} style={{ position: "relative" }}>
			<div
				className={styles["custom-dropdown"]}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className={styles["dropdown-title"]}>
					{title} {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
				</div>
			</div>
			{isOpen ? <div className={styles.popup}>{children}</div> : null}
		</div>
	);
}

function Filter({
	onConfirm,

	location,
	setLocation,
	hoursRange: hoursRange,
	setHoursRange: setHoursRange,
	categories: categoryOptions,
	setCategories: setCategoryOptions,
	keywords,
	setKeywords,
	minHours,
	maxHours,

	areHoursFlexible,
	setAreHoursFlexible,
}: {
	onConfirm?: () => void;
	location: string;
	setLocation: React.Dispatch<React.SetStateAction<string>>;
	hoursRange: [number, number] | "flexible" | null;
	setHoursRange: React.Dispatch<
		React.SetStateAction<[number, number] | "flexible" | null>
	>;
	keywords: string[];
	setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
	categories: string[];
	setCategories: React.Dispatch<React.SetStateAction<string[]>>;
	minHours: number;
	maxHours: number;

	areHoursFlexible: boolean;
	setAreHoursFlexible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	// const [visitedFields, setVisitedFields] = useState([] as string[]);
	const [currentKeyword, setCurrentKeyword] = useState("");

	const barWidth = 200;

	const [minHoursHandlePos, setMinHoursHandlePos] = useState(0);
	const [maxHoursHandlePos, setMaxHoursHandlePos] = useState(barWidth);

	function interpolate(pos: number): number {
		return minHours + (pos / barWidth) * (maxHours - minHours);
	}

	const selectedMinHours = Math.round(interpolate(minHoursHandlePos));
	const selectedMaxHours = Math.round(interpolate(maxHoursHandlePos));

	const isSearchEmpty =
		location === "" &&
		categoryOptions.length === 0 &&
		hoursRange === null &&
		keywords.length === 0;

	return (
		<div id={styles.filter}>
			<div className={styles["filter-option-inputs-container"]}>
				<div style={{ position: "relative" }}>
					<input
						className={styles["filter-textbox"]}
						type="text"
						placeholder="Enter Location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					></input>
				</div>
				<CustomDropdown title="Cause Area">
					{categoryNames.map((category, i) => (
						<div key={i}>
							<div
								onClick={() => {
									const index = categoryOptions.indexOf(category);
									const out: string[] = [...categoryOptions];
									if (index === -1) out.push(category);
									else out.splice(index, 1);

									setCategoryOptions(out);
								}}
								className={styles["category-name"]}
							>
								{category}
							</div>
							{i === categoryNames.length - 1 ? null : (
								<div className={styles["separator-bar"]}></div>
							)}
						</div>
					))}
				</CustomDropdown>
				<CustomDropdown title="Weekly Hours">
					{hoursRange !== "flexible" ? (
						<div className={styles["slider-bar-labels"]}>
							<div className={styles["slider-bar-min-label"]}>
								{selectedMinHours} hours
							</div>
							<div className={styles["slider-bar-max-label"]}>
								{selectedMaxHours} hours
							</div>
						</div>
					) : null}
					{hoursRange === "flexible" ? null : (
						<div className={styles["slider-bar"]}>
							<div
								onDragStart={preventEvent}
								onDrop={preventEvent}
								className={styles["slider-bar-filled-in"]}
								style={{
									left: `${minHoursHandlePos}px`,
									width: `${maxHoursHandlePos - minHoursHandlePos}px`,
								}}
							></div>
							<Handle
								min={0}
								max={maxHoursHandlePos}
								initVal={0}
								setPos={setMinHoursHandlePos}
								onDrop={() => {
									onConfirm?.();
									setHoursRange([selectedMinHours, selectedMaxHours]);
								}}
							/>
							<Handle
								min={minHoursHandlePos}
								max={barWidth}
								initVal={barWidth}
								setPos={setMaxHoursHandlePos}
								onDrop={() => {
									onConfirm?.();
									setHoursRange([selectedMinHours, selectedMaxHours]);
								}}
							/>
						</div>
					)}
					<div className={styles["flexible-hours-container"]}>
						<input
							type="checkbox"
							name="flexible-hours"
							defaultChecked={areHoursFlexible}
							onChange={() => {
								setAreHoursFlexible(!areHoursFlexible);
								if (areHoursFlexible) {
									setHoursRange([
										Math.round(selectedMinHours),
										Math.round(selectedMaxHours),
									]);
								} else {
									setHoursRange("flexible");
								}
							}}
						/>
						<label htmlFor="flexible-hours">Flexible Hours</label>
					</div>
				</CustomDropdown>
				<div
					className={styles["keyword-search-container"]}
					style={{ position: "relative", background: "#FFFFFF" }}
				>
					<SearchIcon />
					<input
						className={styles["filter-textbox"]}
						type="text"
						placeholder="Search by Keyword"
						value={currentKeyword}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								setKeywords(keywords.concat([currentKeyword]));
								setCurrentKeyword("");
							}
						}}
						onChange={(e) => setCurrentKeyword(e.target.value)}
					></input>
					<PlusIcon
						style={{ cursor: "pointer" }}
						onClick={() => {
							setKeywords(keywords.concat([currentKeyword]));
							setCurrentKeyword("");
						}}
					/>
				</div>
			</div>
			<div
				className={`${styles["filter-option-boxes"]} ${
					isSearchEmpty ? "" : styles["not-empty"]
				}`}
			>
				<SelectionOptionsSet
					selectionOptions={location === "" ? [] : [location]}
					setSelectionOptions={() => setLocation("")}
				/>
				<SelectionOptionsSet
					selectionOptions={categoryOptions}
					setSelectionOptions={deleteFromList(setCategoryOptions)}
				/>
				<SelectionOptionsSet
					selectionOptions={
						hoursRange === null
							? []
							: hoursRange === "flexible"
							? ["Flexible hours"]
							: hoursRange[0] === hoursRange[1]
							? [`${hoursRange[0]} hours per week`]
							: [`${hoursRange[0]}-${hoursRange[1]} hours per week`]
					}
					setSelectionOptions={() => setHoursRange(null)}
				/>
				<SelectionOptionsSet
					selectionOptions={keywords}
					setSelectionOptions={deleteFromList(setKeywords)}
				/>
				{isSearchEmpty ? null : (
					<div
						className={styles["clear-all"]}
						onClick={() => {
							setLocation("");
							setCategoryOptions([]);
							setHoursRange(null);
							setKeywords([]);
							// no need to do onConfirm because we are setting the arrays
						}}
					>
						Clear All
					</div>
				)}
			</div>
		</div>
	);
}

function SelectionOptionsSet({
	selectionOptions,
	setSelectionOptions,
}: {
	selectionOptions: string[];
	setSelectionOptions: (selectionOptions: string[], index: number) => void;
}) {
	return (
		<>
			{selectionOptions.map((el, i) => (
				<div key={i} className={styles["filter-option-box"]}>
					<CloseIcon
						className={styles["filter-option-box-close"]}
						onClick={() => setSelectionOptions(selectionOptions, i)}
					/>{" "}
					{el}
				</div>
			))}
		</>
	);
}

function Handle({
	max,
	min,
	initVal,
	setPos,
	onDrop,
	onDrag,
}: {
	onDrag?: () => void;
	onDrop?: () => void;
	max: number;
	min: number;
	initVal: number;
	setPos: Dispatch<SetStateAction<number>>;
}) {
	const [posBetweenDrags, setPosBetweenDrags] = useState(initVal);
	const [mousePosBeforeDrag, setMousePosBeforeDrag] = useState(
		null as number | null
	);
	const [mousePos, setMousePos] = useState(0);

	const selfRef: RefObject<HTMLDivElement> = useRef(null);

	let pos =
		mousePosBeforeDrag === null
			? posBetweenDrags
			: posBetweenDrags + mousePos - mousePosBeforeDrag;
	pos = Math.max(min, pos);
	pos = Math.min(max, pos);

	// wait until the parent component stops rendering
	setTimeout(() => {
		setPos(pos);
	});

	return (
		<div
			onDragStart={preventEvent}
			onDrop={preventEvent}
			onPointerDown={(e) => {
				if (selfRef.current) {
					onDrag?.();
					setMousePos(e.clientX);
					setMousePosBeforeDrag(e.clientX);
					selfRef.current.setPointerCapture(e.pointerId);
					selfRef.current.onpointermove = (e) => {
						setMousePos(e.clientX);
					};
				}
			}}
			onPointerUp={(e) => {
				if (selfRef.current) {
					onDrop?.();
					setPosBetweenDrags(pos);
					setMousePosBeforeDrag(null);
					selfRef.current.onpointermove = null;
					selfRef.current.releasePointerCapture(e.pointerId);
				}
			}}
			ref={selfRef}
			className={styles["slider-handle"]}
			style={{ left: `${pos}px` }}
		></div>
	);
}

function deleteFromList(
	setSelectionOptions: Dispatch<SetStateAction<string[]>>
) {
	return (selectionOptions: string[], i: number) => {
		const out = [...selectionOptions];
		out.splice(i, 1);
		setSelectionOptions(out);
	};
}

export const getServerSideProps: GetServerSideProps<{
	listings: ListingType[];
	maxHours: number;
	minHours: number;
}> = async (context: any) => {
	await getMongo(); // connect
	// TODO: there has to be a better way than this
	const listings = await Listing.find({}).populate("organisation");

	const processedListings: ListingType[] = listings.map(getCleanListingData);

	// TODO: cache that?

	const maxHours = (
		await Listing.find({}, "maxHoursPerWeek -_id")
			.sort({
				maxHoursPerWeek: -1,
			})
			.limit(1)
	)[0].maxHoursPerWeek;
	const minHours = 0;

	return {
		props: { listings: processedListings, minHours, maxHours }, // will be passed to the page component as props
	};
};
