import React, {
	Dispatch,
	DispatchWithoutAction,
	ReactElement,
	ReactNode,
	Ref,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import Head from "../client/components/Head";

import FeaturedCard from "../client/components/FeaturedCard";

import Link from "next/link";
import Card from "../client/components/Card";

import styles from "../client/styles/searchListings.module.css";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { addVisitedField, getFieldClasses } from "../client/utils/formUtils";
import { categoryNames } from "../client/utils/const";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import PlusIcon from "@material-ui/icons/Add";

import { Category } from "@material-ui/icons";

type Listing = {
	imagePath: string;
	title: string;
	organisationName: string;
	desc: string;
	uuid: string;
};

const MAX_LISTINGS_PER_PAGE = 6;

const preventEvent = (e: {
	preventDefault: () => void;
	stopPropagation: () => void;
}) => {
	e.preventDefault();
	e.stopPropagation();
};

function SearchListings() {
	const listings: Listing[] = [
		{
			imagePath: "/img/cad.jpg",
			title: "TITLE",
			organisationName: "ORG NAME",
			desc: "DESC and a bunch of words A loan of $7,700 helps a member who is going to stock up with bundles of used clothing, which will build up...",
			uuid: "3",
		},
	];

	for (let i = 0; i < 6; i++) {
		listings.push(...listings);
	}

	const pagesNum = Math.ceil(listings.length / MAX_LISTINGS_PER_PAGE);
	const [selectedPage, setSelectedPage] = useState(2);
	const [showFilter, setShowFilter] = useState(false);

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
						style={{ cursor: "pointer" }}
						onClick={() => setShowFilter(!showFilter)}
					>
						<img className={styles["filter-img"]} src={"/img/filter.svg"} />
						<p>Filter</p>
					</div>
				</div>
			</div>

			<div className={styles["main-content"]}>
				{showFilter ? <Filter></Filter> : null}
				<div className={styles["featured-card-wrapper"]}>
					<h1 className="w-1000 bold">
						Featured: Volunteering Opportunity in {"<category>"}
					</h1>
					<p className="w-1000">TITLE</p>
					<FeaturedCard
						imagePath="/img/cad.jpg"
						title="TITLE"
						organisationName="ORG NAME"
						desc="DESC and a bunch of words A loan of $7,700 helps a member who is going to stock up with bundles of used clothing, which will build up..."
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

function Filter() {
	const [visitedFields, setVisitedFields] = useState([] as string[]);
	const [categoryOptions, setCategoryOptions] = useState([] as string[]);
	const [keywords, setKeywords] = useState([] as string[]);

	const [location, setLocation] = useState("");
	const [currentKeyword, setCurrentKeyword] = useState("");

	const minHours = 10;
	const maxHours = 100; //TODO: get the actual values

	const barWidth = 200;

	const [minHoursHandlePos, setMinHoursHandlePos] = useState(0);
	const [maxHoursHandlePos, setMaxHoursHandlePos] = useState(0);

	function interpolate(pos: number): number {
		return minHours + (pos / barWidth) * (maxHours - minHours);
	}

	const selectedMinHours = interpolate(minHoursHandlePos);
	const selectedMaxHours = interpolate(maxHoursHandlePos);

	const [hoursRangeToDisplay, setHoursRangeToDisplay] = useState(
		null as null | [number, number] | "flexible"
	);
	const [areHoursFlexible, setAreHoursFlexible] = useState(false);

	const isSearchEmpty =
		location === "" &&
		categoryOptions.length === 0 &&
		hoursRangeToDisplay === null &&
		keywords.length === 0;

	useEffect(() => {
		setHoursRangeToDisplay([
			Math.round(selectedMinHours),
			Math.round(selectedMaxHours),
		]);
	}, [minHoursHandlePos, maxHoursHandlePos]);

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
					{Array.isArray(hoursRangeToDisplay) ? (
						<div className={styles["slider-bar-labels"]}>
							<div className={styles["slider-bar-min-label"]}>
								{hoursRangeToDisplay[0]} hours
							</div>
							<div className={styles["slider-bar-max-label"]}>
								{hoursRangeToDisplay[1]} hours
							</div>
						</div>
					) : null}
					{hoursRangeToDisplay === "flexible" ? null : (
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
							/>
							<Handle
								min={minHoursHandlePos}
								max={barWidth}
								initVal={barWidth}
								setPos={setMaxHoursHandlePos}
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
									setHoursRangeToDisplay([
										Math.round(selectedMinHours),
										Math.round(selectedMaxHours),
									]);
								} else {
									setHoursRangeToDisplay("flexible");
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
						hoursRangeToDisplay === null
							? []
							: hoursRangeToDisplay === "flexible"
							? ["Flexible hours"]
							: hoursRangeToDisplay[0] === hoursRangeToDisplay[1]
							? [`${hoursRangeToDisplay[0]} hours per week`]
							: [
									`${hoursRangeToDisplay[0]}-${hoursRangeToDisplay[1]} hours per week`,
							  ]
					}
					setSelectionOptions={() => setHoursRangeToDisplay(null)}
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
							setHoursRangeToDisplay(null);
							setKeywords([]);
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
}: {
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
