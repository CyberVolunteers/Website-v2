import {
	Children,
	Component,
	Dispatch,
	ReactChild,
	ReactChildren,
	ReactComponentElement,
	ReactElement,
	ReactNode,
	Ref,
	RefObject,
	SetStateAction,
	useRef,
	useState,
} from "react";
import Head from "../client/components/Head";
import IndexCard from "../client/components/IndexCard";
import CommunityCard from "../client/components/CommunityCard";

import Link from "next/link";

// import { HandleSliderMovement } from "../client/js/HandleSliderMovement";
import {
	useIsAfterRehydration,
	useWindowSize,
} from "../client/utils/otherHooks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSurprise } from "@fortawesome/free-regular-svg-icons";

import {
	faDollarSign,
	faHandsHelping,
	faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
	CarouselListingData,
	categoryNames,
	indexPageListings,
} from "../client/utils/const";

export const MAX_LISTINGS_PER_REEL = 3;

export default function Home(): ReactElement {
	// if (useIsAfterRehydration()) HandleSliderMovement();
	const [categoryIndex, setCategoryIndex] = useState(0);
	const applicableListings = indexPageListings.filter(
		(el) => el.categoryIndex === categoryIndex
	);
	const applicableListingGroupings: CarouselListingData[][] = [[]];
	applicableListings.forEach((el) => {
		function getLastGrouping() {
			return applicableListingGroupings[applicableListingGroupings.length - 1];
		}
		if (getLastGrouping().length >= MAX_LISTINGS_PER_REEL)
			applicableListingGroupings.push([]);
		getLastGrouping().push(el);
	});

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

	return (
		<div>
			<Head title="Cybervolunteers" />

			<div className="main-page">
				{/* Video Section */}
				<div className="video-section">
					<video
						src="/video/cybervolunteers-intro.mp4"
						autoPlay
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
							<Link href="#">Find an opportunity</Link>
						</span>
					</div>
				</div>

				{/* Support Case */}

				<div className="support-case-section">
					<h1 style={{ textAlign: "center", color: "#4D4D4D" }}>
						Support Causes you care about
					</h1>
					<div className="top-navigation-area">
						<div className={`icon-wrapper left`}>
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
							<div className="reel first-reel reel-h3">
								<Carousel
									viewWindowRef={catReelViewWindowRef}
									className="cat-reel"
									setFirstVisibleElement={setFirstVisibleCat}
									firstVisibleElement={firstVisibleCat}
									firstElementRef={firstCatRef}
									numberOfElements={categoryNames.length}
									setHasReelHitTheEnd={setHasCatReelHitTheEnd}
								>
									{categoryNames.map((name, i) => (
										<h3
											className={`${
												categoryIndex === i ? "active" : ""
											} reel-h3`}
											id="top-nav-1"
											key={i}
											onClick={() => setCategoryIndex(i)}
										>
											{name}
										</h3>
									))}
								</Carousel>
							</div>
						</div>

						<div className="icon-wrapper right">
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
												key={i}
												img="/img/placeholder1.jpg"
												title={el.opportunityTitle}
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
													padding: "3rem 1.5rem",
												}}
											>
												<Link href="#">View all loans to women</Link>
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

				{/* how it works */}

				<div className="how-it-works-section">
					<h1>How it works</h1>
					<p>
						Easily find volunteering opportunities on Cyber Volunteers to
						support causes that you care about and have a real impact.
					</p>

					<div className="steps-area">
						<div className="step">
							<div className="space-8"></div>

							<FontAwesomeIcon
								icon={faUserCircle}
								style={{
									marginBottom: "8px",
								}}
							/>

							<div className="presentation">
								<h3>Make an Account</h3>
								<p>Create your personal account to connect with charities.</p>
							</div>
						</div>
						<div className="step">
							<div className="space-8"></div>

							<img
								className="icon-48"
								alt=""
								src="/img/mag_glass_icon.svg"
							></img>

							<div className="space-8"></div>

							<div className="presentation">
								<h3>Find an Opportunity</h3>
								<p>
									Browse our opportunities and find a charity to volunteer for.
								</p>
							</div>
						</div>
						<div className="step">
							<img className="icon-64" alt="" src="/img/mail_icon.svg"></img>
							<div className="presentation">
								<h3>Register your interest</h3>
								<p>
									Simply click "Volunteer Now" to notify the charity of your
									interest.
								</p>
							</div>
						</div>
						<div className="step">
							<div className="space-8"></div>
							<FontAwesomeIcon
								icon={faHandsHelping}
								style={{
									marginBottom: "8px",
								}}
							/>

							<div className="presentation">
								<h3>Volunteer</h3>
								<p>
									Volunteer and help support meaningful causes you care about.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Community Area */}

				<div
					className="community-section"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<h1
						style={{ textAlign: "center", color: "#4D4D4D" }}
						className="landing-heading"
					>
						What our volunteering community thinks
					</h1>

					<div className="community-cards-wrapper">
						<CommunityCard
							text="Being able to find local opportunities this easily makes the process so much quicker and means I can spend more time actually volunteering."
							img_src="/img/headshot1.png"
							title="Elijah Taylor"
							subtitle="Volunteer"
						/>
						<CommunityCard
							text="Being able to find causes I care about has allowed me to engage more with my community and have more of an impact."
							img_src="/img/headshot2.png"
							title="Elijah Taylor"
							subtitle="Volunteer"
						/>
					</div>

					<h1
						style={{ marginTop: "30px", fontWeight: 400 }}
						className="make-loan-heading"
					>
						Volunteer now!
					</h1>
					<span className="find-opportunity-button">
						<Link href="#">Find an opportunity</Link>
					</span>
				</div>

				{/* volenteer area */}
				<div className="volenteer-area">
					<h1>
						Cyber <br />
						Volunteer for nonprofits.
					</h1>

					<img src="/img/child1.jpg" />
				</div>

				<ul>
					<li>
						<div className="icon-wrapper">
							<img className="icon-64" src="/img/org_icon.svg" />
							<p>Create your organisation's profile.</p>
						</div>
					</li>
					<li>
						<div className="icon-wrapper">
							<img className="icon-64" src="/img/listings_icon.svg" />
							<p>Create volunteering opportunities.</p>
						</div>
					</li>
					<li>
						<div className="icon-wrapper">
							<img className="icon-64" src="/img/volunteers_icon.svg" />
							<p>Get connected to passionate volunteers.</p>
						</div>
					</li>
				</ul>

				{/* get started button */}

				<div className="button-wrapper">
					<a href="#">Get Started</a>
				</div>

				{/* image area */}

				{/* <div className="image-wrapper" style={{ margin: "4rem auto" }}>
					<img src="/img/student.jpg" style={{ width: "100%" }} />
				</div> */}
			</div>
		</div>
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

	let proposedTransform: number = 0;
	const width = viewWindowRef?.current?.clientWidth;
	const elementWidth = firstElementRef?.current?.clientWidth;
	if (typeof width === "number" && typeof elementWidth === "number") {
		proposedTransform = firstVisibleElement * elementWidth;

		// position of the last element relative to the view window in the reel
		const lastElementPosition =
			numberOfElements * elementWidth - proposedTransform;

		// if the last element turns out to be in a place that shows empty space, bring it back
		if (lastElementPosition <= width) {
			// undo it if not scrolling
			// lastElementPosition has to equal the width
			// width = numberOfElements * elementWidth - proposedTransform;
			proposedTransform = numberOfElements * elementWidth - width;

			// make sure we do not "scroll" past what is possible
			// can only do that asynchronously
			setTimeout(() => {
				setHasReelHitTheEnd(true);
			});
			// do not snap to anything when dragging
			if (initX !== null) {
				setTimeout(() => {
					setFirstVisibleElement(Math.ceil(proposedTransform / elementWidth));
				});
			}
		}

		// account for drag
		if (initX !== null) {
			proposedTransform -= newX - initX;
		}
	}

	// handle dragging
	if (selfRef.current) {
		selfRef.current.onpointerdown = (e) => {
			e.preventDefault();
			if (selfRef.current) {
				setInitX(e.x);
				setNewX(e.x);
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
				setHasReelHitTheEnd(false);

				// determine which slide to show
				// proposedTransform = firstVisibleElement * elementWidth;
				if (elementWidth !== undefined) {
					firstVisibleElement = proposedTransform / elementWidth;
					// Do not scroll past 0
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
