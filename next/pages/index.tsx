import {
	Dispatch,
	ReactElement,
	ReactNode,
	RefObject,
	SetStateAction,
	useRef,
	useState,
} from "react";
import Head from "../client/components/Head";
import IndexCard from "../client/components/IndexCard";

import Link from "next/link";

import { useWindowSize } from "../client/utils/otherHooks";

import {
	categoryNames as rawCategoryNames,
	indexCardListings,
} from "../client/utils/const";
import {
	GetServerSideProps,
	GetStaticProps,
	InferGetServerSidePropsType,
	InferGetStaticPropsType,
} from "next";
import { Listing } from "../server/mongo/mongoModels";
import { getMongo } from "../server/mongo";
import IdeaShowcase from "../client/components/IdeaShowcase";

const touchDelay = 150;

export default function Home({
	indexListings,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const categoryNamesToShow = rawCategoryNames.slice(0, 5);
	// if (useIsAfterRehydration()) HandleSliderMovement();
	const [categoryIndex, setCategoryIndex] = useState(0);
	const applicableListings = indexListings.filter(
		(el) => el.categoryIndex === categoryIndex
	);

	const [firstVisibleCard, setFirstVisibleCard] = useState(0);
	const [hasCardReelHitTheEnd, setHasCardReelHitTheEnd] = useState(false);
	const firstCardRef: RefObject<HTMLDivElement> = useRef(null);
	const cardReelViewWindowRef: RefObject<HTMLDivElement> = useRef(null);

	const [firstVisibleCat, setFirstVisibleCat] = useState(0);
	const [hasCatReelHitTheEnd, setHasCatReelHitTheEnd] = useState(false);
	const firstCatRef: RefObject<HTMLDivElement> = useRef(null);
	const catReelViewWindowRef: RefObject<HTMLDivElement> = useRef(null);

	// make sure to rerender on window size changes
	const windowWidth = useWindowSize().width;

	const cardsNumToSkip = 1;
	// windowWidth === undefined
	// 	? 3
	// 	: windowWidth <= 800
	// 	? 1
	// 	: windowWidth <= 1150
	// 	? 2
	// 	: 3;

	const catsNumToSkip = 1;

	return (
		<div style={{ overflow: "hidden" }}>
			<Head title="Cybervolunteers" />

			<div className="main-page">
				{/* Video Section */}
				<div className="video-section">
					<video
						src="/video/cybervolunteers-intro.mp4"
						muted
						controls
						style={{ width: "100%" }}
					></video>
					<div className="presentation">
						<h1 className="main-heading">
							Connecting people
							<span className="main-heading-span">with purpose</span>
						</h1>
						<span className="first-section-button">
							<Link href="/searchListings">Find an opportunity</Link>
						</span>
					</div>
				</div>

				{/* Support Case */}

				<div className="support-case-section">
					<h1 style={{ textAlign: "center", color: "#4D4D4D" }}>
						Support Causes you care about
					</h1>
					<div className="top-navigation-area">
						<div
							className={`icon-wrapper ${
								firstVisibleCat <= 0 ? "disable" : ""
							} left`}
							onClick={() => {
								setHasCatReelHitTheEnd(false);
								if (firstVisibleCat > 0)
									setFirstVisibleCat(firstVisibleCat - catsNumToSkip);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="23"
								height="23"
								viewBox="0 0 202.23 391.319"
							>
								<path
									id="Path_64095"
									data-name="Path 64095"
									d="M271.456,383.791l157.3-194.7,44.921,44.927L353.863,383.808,473.686,533.619l-44.944,46.795Z"
									transform="translate(-271.456 -189.095)"
									fill="#fff"
								/>
							</svg>
						</div>
						<div className="reel-wrapper">
							<div
								className="reel first-reel reel-h3"
								ref={catReelViewWindowRef}
							>
								<Carousel
									viewWindowRef={catReelViewWindowRef}
									className="cat-reel"
									setFirstVisibleElement={setFirstVisibleCat}
									firstVisibleElement={firstVisibleCat}
									firstElementRef={firstCatRef}
									numberOfElements={categoryNamesToShow.length}
									setHasReelHitTheEnd={setHasCatReelHitTheEnd}
								>
									{categoryNamesToShow.map((name, i) => (
										<CarouselHeader
											key={i}
											categoryIndex={categoryIndex}
											i={i}
											setFirstVisibleCard={setFirstVisibleCard}
											setCategoryIndex={setCategoryIndex}
											firstCatRef={firstCatRef}
											name={name}
										/>
									))}
								</Carousel>
							</div>
						</div>

						<div
							className={`icon-wrapper  ${
								hasCatReelHitTheEnd ? "disable" : ""
							} right`}
							onClick={() => {
								if (!hasCatReelHitTheEnd)
									setFirstVisibleCat(firstVisibleCat + catsNumToSkip);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="23"
								height="23"
								viewBox="0 0 202.23 391.319"
							>
								<path
									id="Path_64095"
									data-name="Path 64095"
									d="M271.456,383.791l157.3-194.7,44.921,44.927L353.863,383.808,473.686,533.619l-44.944,46.795Z"
									transform="translate(-271.456 -189.095)"
									fill="#fff"
								/>
							</svg>
						</div>
					</div>

					<div
						className="request-navigation-area "
						style={{ margin: "2rem auto" }}
					>
						<div
							className={`icon-wrapper ${
								firstVisibleCard <= 0 ? "disable" : ""
							} left`}
							onClick={() => {
								setHasCardReelHitTheEnd(false);
								if (firstVisibleCard > 0)
									setFirstVisibleCard(firstVisibleCard - cardsNumToSkip);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="23"
								height="23"
								viewBox="0 0 202.23 391.319"
							>
								<path
									id="Path_64095"
									data-name="Path 64095"
									d="M271.456,383.791l157.3-194.7,44.921,44.927L353.863,383.808,473.686,533.619l-44.944,46.795Z"
									transform="translate(-271.456 -189.095)"
									fill="#fff"
								/>
							</svg>
						</div>

						<div className="reel-wrapper">
							<div className="reel second-reel" ref={cardReelViewWindowRef}>
								<Carousel
									viewWindowRef={cardReelViewWindowRef}
									className="cards-wrap"
									setFirstVisibleElement={setFirstVisibleCard}
									firstVisibleElement={firstVisibleCard}
									firstElementRef={firstCardRef}
									numberOfElements={applicableListings.length + 1} // including the "see more" card
									setHasReelHitTheEnd={setHasCardReelHitTheEnd}
								>
									{applicableListings
										.map((el, i) => (
											<IndexCard
												uuid={el.uuid}
												key={i}
												img={el.imgName}
												title={el.title}
												subtitle={el.charityName}
												desc={el.desc}
												divRef={i === 0 ? firstCardRef : undefined}
												// meternow="20"
												// totalgo="120"
											/>
										))
										.concat(
											<div
												key="final card"
												className="card-wrapper link-box"
												style={{
													textAlign: "center",
													padding: "3rem 1.5rem",
												}}
											>
												<Link href="#">
													{categoryIndex === 4
														? `View all listings about ${categoryNamesToShow[categoryIndex]}` // Make sure nothing weird happens
														: `View all ${categoryNamesToShow[categoryIndex]} listings`}
												</Link>
											</div>
										)}
								</Carousel>
							</div>
						</div>
						<div
							className={`icon-wrapper  ${
								hasCardReelHitTheEnd ? "disable" : ""
							} right`}
							onClick={() => {
								if (!hasCardReelHitTheEnd)
									setFirstVisibleCard(firstVisibleCard + cardsNumToSkip);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="23"
								height="23"
								viewBox="0 0 202.23 391.319"
							>
								<path
									id="Path_64095"
									data-name="Path 64095"
									d="M271.456,383.791l157.3-194.7,44.921,44.927L353.863,383.808,473.686,533.619l-44.944,46.795Z"
									transform="translate(-271.456 -189.095)"
									fill="#fff"
								/>
							</svg>
						</div>
					</div>
				</div>
				<IdeaShowcase />
			</div>
		</div>
	);
}

function CarouselHeader({
	categoryIndex,
	i,
	setFirstVisibleCard,
	setCategoryIndex,
	firstCatRef,
	name,
}: {
	categoryIndex: number;
	i: number;

	setFirstVisibleCard: Dispatch<SetStateAction<number>>;
	setCategoryIndex: Dispatch<SetStateAction<number>>;
	firstCatRef: RefObject<HTMLDivElement>;
	name: string;
}) {
	const [touchTime, setTouchTime] = useState(null as null | number);
	const _selfRef: RefObject<HTMLDivElement> = useRef(null);
	const selfRef = i === 0 ? firstCatRef : _selfRef;

	return (
		<h3
			className={`${categoryIndex === i ? "active" : ""} reel-h3`}
			id="top-nav-1"
			key={i}
			onPointerDown={(e) => {
				setTouchTime(Date.now());

				// make sure that the carousel doesn't get the event
				selfRef?.current?.setPointerCapture?.(e.pointerId);
			}}
			onPointerUp={(e) => {
				selfRef?.current?.releasePointerCapture?.(e.pointerId);

				if (touchTime === null || Date.now() - touchTime > touchDelay)
					return setTouchTime(null);
				setFirstVisibleCard(0);
				setCategoryIndex(i);

				return setTouchTime(null);
			}}
			ref={selfRef}
		>
			<div className="cat-text-container">
				<p>{name}</p>
				<div className="selected-option-underline"></div>
			</div>
		</h3>
	);
}

function Carousel({
	children,
	firstVisibleElement,
	setFirstVisibleElement,
	className,
	// cardsNum,
	firstElementRef,
	numberOfElements,
	viewWindowRef,
	setHasReelHitTheEnd,
}: {
	firstVisibleElement: number;
	setFirstVisibleElement: Dispatch<SetStateAction<number>>;
	setHasReelHitTheEnd: Dispatch<SetStateAction<boolean>>;
	className: string;
	children: ReactNode;
	firstElementRef: RefObject<HTMLDivElement>;
	viewWindowRef: RefObject<HTMLDivElement>;
	numberOfElements: number;
}): ReactElement {
	const selfRef: RefObject<HTMLDivElement> = useRef(null);

	let [initX, setInitX] = useState(null as number | null);
	let [newX, setNewX] = useState(0);

	const [proposedTransformOnClick, setProposedTransformOnClick] = useState(0);

	const width = viewWindowRef?.current?.clientWidth;
	const elementWidth = firstElementRef?.current?.clientWidth;

	let proposedTransform: number = 0;
	if (typeof width === "number" && typeof elementWidth === "number") {
		// only do this if it is not dragged:
		if (initX === null) {
			proposedTransform = firstVisibleElement * elementWidth;
			// position of the last element relative to the view window in the reel
			const lastElementPosition =
				numberOfElements * elementWidth - proposedTransform;

			const hasHitTheEnd = lastElementPosition <= width;
			// if the last element turns out to be in a place that shows empty space, bring it back
			if (hasHitTheEnd) {
				// lastElementPosition has to equal the width
				// width = numberOfElements * elementWidth - proposedTransform;
				proposedTransform = numberOfElements * elementWidth - width;

				// make sure we do not "scroll" past what is possible
				// can only do that asynchronously
			}
			setTimeout(() => {
				setHasReelHitTheEnd(hasHitTheEnd);
			});
		} else {
			// account for dragging
			proposedTransform = proposedTransformOnClick + initX - newX;
		}
	}

	// handle dragging
	if (selfRef.current) {
		selfRef.current.onpointerdown = (e) => {
			e.preventDefault();
			if (selfRef.current) {
				setInitX(e.x);
				setNewX(e.x);
				setProposedTransformOnClick(proposedTransform);
				selfRef.current.setPointerCapture(e.pointerId);
			}
		};
		selfRef.current.onpointermove = (e) => {
			setNewX(e.x);
		};
		selfRef.current.onpointerup = (e) => {
			if (selfRef.current) {
				selfRef.current.onpointermove = null;
				selfRef.current.releasePointerCapture(e.pointerId);
				setInitX(null);

				if (elementWidth !== undefined) {
					// determine which slide to show
					// proposedTransform = firstVisibleElement * elementWidth;
					firstVisibleElement = proposedTransform / elementWidth;
					// Do not scroll past 0; get the closest one
					setFirstVisibleElement(Math.max(0, Math.round(firstVisibleElement)));
				}
			}
		};
	}

	return (
		<div
			ref={selfRef}
			className={`carousel ${className}`}
			style={{
				transform: `translateX(-${proposedTransform}px)`,
				transition:
					// only do animations if not dragging to ensure it is responsive when dragged
					initX === null ? "500ms transform" : undefined,
			}}
		>
			{children}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	indexListings: {
		uuid: string;
		categoryIndex: number;
		charityName: string;

		imgName: string;
		desc: string;
		title: string;
	}[];
}> = async () => {
	await getMongo();
	const listings = await Listing.find({});
	const indexListings = indexCardListings.map((l) => {
		// TODO: use a more appropriate, efficient way
		const completeListing = listings.find(
			(_l: any) => _l.uuid === l.uuid && !_l.categories.includes("scraped")
		);
		if (!completeListing)
			throw new Error(
				`Could not find a listing with the uuid ${
					l.uuid
				} in the listing ${JSON.stringify(l)}`
			);
		return {
			...l,
			imgName: completeListing?.imagePath,
			desc: completeListing?.desc,
			title: completeListing?.title,
		};
	});
	return {
		props: {
			indexListings,
		},
	};
};
