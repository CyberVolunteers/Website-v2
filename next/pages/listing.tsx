import Image from "next/image";
import { Button, capitalize, CircularProgress } from "@material-ui/core";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useState } from "react";
import { ReactElement } from "react";
import Head from "../client/components/Head";
import { getMongo } from "../server/mongo";
import { Listing } from "../server/mongo/mongoModels";
import { toStrippedObject } from "../server/mongo/util";
import {
	undoCamelCase,
	updateOverallErrorsForRequests,
} from "../client/utils/misc";
import {
	useIsAfterRehydration,
	useViewProtection,
} from "../client/utils/otherHooks";
import { updateCsrf } from "../server/csrf";
import { getSession } from "../server/auth/auth-cookie";
import { isVerifiedOrg, isVerifiedUser } from "../server/auth/data";
import { ListingJoinPrompt } from "../client/components/ListingJoinPrompt";
import { getAccountInfo } from "../client/utils/userState";
import EditableField from "../client/components/EditableField";
import { listingFieldNamesToShow } from "../serverAndClient/displayNames";
import { listings } from "../serverAndClient/publicFieldConstants";
import { getSignupPerElementValidationCallbacks } from "../client/components/Signup";
import { flatten } from "combined-validator";
import { getPresentableName } from "../client/components/FormComponent";
import { csrfFetch } from "../client/utils/csrf";

export default function ListingPage({
	listing,
	csrfToken,
	isOwnerOrg,
	hasAppliedForListing,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org", "user"]);

	const fieldsToShowOverall = isOwnerOrg
		? fieldsToShowCommon.concat(fieldsToShowOwnerOnly)
		: fieldsToShowCommon;

	const isAfterHydration = useIsAfterRehydration();

	const isOrg = getAccountInfo()?.isOrg;

	const [fields, setFields] = useState(listing as { [key: string]: any });

	const [showVolunteerPopup, setShowVolunteerPopup] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [overallErrors, setOverallErrors] = useState(
		{} as { [key: string]: any }
	);

	async function sendEditRequest(k: string, v: any) {
		const data = { uuid: listing.uuid } as { [key: string]: any };
		data[k] = v;
		if (v === null) return; // do not submit data with errors

		setIsLoading(true);

		const res = await csrfFetch(csrfToken, "/api/updateListingData", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(data),
		});

		if (
			!(await updateOverallErrorsForRequests(
				res,
				"listingUpdateData",
				overallErrors,
				setOverallErrors
			))
		)
			return setIsLoading(false);

		setIsLoading(false);

		// set the new value through a copy
		const fieldsCopy = Object.assign({}, fields);
		fieldsCopy[k] = v;
		setFields(fieldsCopy);
	}

	return (
		<div>
			<Head title={`${capitalize(listing.title)} - cybervolunteers`} />
			<h1>{capitalize(listing.title)}</h1>

			<div
				className={"img-container"}
				style={{
					width: "100%",
					height: "250px",
				}}
			>
				<Image
					src={listing.imagePath}
					// width={100}
					// height={100}
					sizes={"30vw"}
					layout="fill"
					objectPosition="center top"
					objectFit="contain"
					alt="Listing image"
				/>
			</div>

			{Object.entries(overallErrors).map(([k, v]) => (
				<h1 key={k}>{v}</h1>
			))}

			{fieldsToShowOverall.map((k) => {
				const v = fields[k];
				return (
					<EditableField
						key={k}
						name={k}
						value={translateToString(k, v)}
						presentableNames={listingFieldNamesToShow}
						editableFields={flatten(listings)}
						sendEditRequest={sendEditRequest}
						perElementValidationCallbacks={getSignupPerElementValidationCallbacks(
							overallErrors,
							setOverallErrors
						)} //TODO: change this
						isLocked={!isOwnerOrg}
					></EditableField>
				);
			})}

			{/* display on the client */}
			{!isAfterHydration ? null : (
				<>
					{isOrg ? (
						<>
							{isOwnerOrg ? null : (
								<p>
									We are sorry, but this listing does not belong to your
									organisation and you can not edit it.
								</p>
							)}
						</>
					) : (
						<>
							{/* It is a user */}
							{hasAppliedForListing ? (
								<>
									<p>You have already applied to this listing!</p>
								</>
							) : (
								<>
									<Button
										onClick={() => setShowVolunteerPopup(!showVolunteerPopup)}
									>
										<p>want to help</p>
									</Button>

									{/* The popup shown after the user clicks on "i want to help" button */}
									{showVolunteerPopup ? (
										<ListingJoinPrompt
											csrfToken={csrfToken}
											listing={listing}
											overallErrors={overallErrors}
											setOverallErrors={setOverallErrors}
										></ListingJoinPrompt>
									) : null}
								</>
							)}
						</>
					)}
				</>
			)}

			{isLoading ? <CircularProgress /> : null}
		</div>
	);
}

function getTargetAudienceString(targetAudience: { [key: string]: boolean }) {
	const targetAudienceNameArray = Object.keys(targetAudience).filter(
		(k) => (targetAudience as any)[k] === true
	);
	if (
		targetAudienceNameArray.length === 0 ||
		targetAudienceNameArray.length === Object.keys(targetAudience).length
	)
		// if anyone or no-one, select everyone
		return "Anyone";
	if (targetAudienceNameArray.length === 1)
		return undoCamelCase(targetAudienceNameArray[0]);
	// get all but the last one
	const lastVal = targetAudienceNameArray.pop() as string;
	return `${targetAudienceNameArray
		.map(undoCamelCase)
		.join(", ")} and ${undoCamelCase(lastVal)}`;
}

function getLocationString(location: {
	place: string;
	street: string;
	city: string;
	county: string;
	isOnline: boolean;
}) {
	if (location.isOnline === true) return "online";
	const { place, street, city, county } = location;
	return [place, street, city, county].join(", ");
}

//TODO: capitalize?
function translateToString(k: string, input: any) {
	switch (typeof input) {
		case "string":
			return input;
		case "number":
			return "" + input;
		case "boolean":
			return input ? "yes" : "no";
	}

	switch (k) {
		case "targetAudience":
			return getTargetAudienceString(input);
		case "location":
			return getLocationString(input);
		case "requiredData":
			return input
				.map((value: any) => getPresentableName(value, listingFieldNamesToShow))
				.join(", ");
	}

	return "" + input;
}

const allowedFields = [
	"imagePath",
	"uuid",
	"currentNumVolunteers",
	"requestedNumVolunteers",
	"requiredData",
	"orgName",
	"category",
	"title",
	"desc",
	"duration",
	"time",
	"skills",
	"requirements",
	"targetAudience",
	"location",
	"isFlexible",
	"minHoursPerWeek",
	"maxHoursPerWeek",
];

const fieldsToShowCommon = [
	"currentNumVolunteers",
	"requestedNumVolunteers",
	"category",
	"title",
	"desc",
	"duration",
	"time",
	"skills",
	"requirements",
	"targetAudience",
	"location",
	"isFlexible",
	"minHoursPerWeek",
	"maxHoursPerWeek",
];

const fieldsToShowOwnerOnly = ["requiredData"];

export type ListingPageListingData = {
	imagePath: string;
	uuid: string;
	currentNumVolunteers: number;
	requestedNumVolunteers: number;
	requiredData: string[];
	orgName: string;
	title: string;
	desc: string;
	duration: string;
	time: string;
	skills: string;
	requirements: string;
	targetAudience: {
		under16: boolean;
		between16And18: boolean;
		between18And55: boolean;
		over55: boolean;
	};
	location: {
		place: string;
		street: string;
		city: string;
		county: string;
		isOnline: boolean;
	};
	isFlexible: boolean;
	minHoursPerWeek: number;
	maxHoursPerWeek: number;
};

export const getServerSideProps: GetServerSideProps<{
	listing: ListingPageListingData;
	csrfToken: string;
	isOwnerOrg: boolean;
	hasAppliedForListing: boolean;
}> = async (context) => {
	const uuid = context.query.uuid;
	if (typeof uuid !== "string")
		return {
			notFound: true,
			props: {},
		};

	const session = await getSession(context.req as any);

	await getMongo(); // connect
	let listing = await Listing.findOne({ uuid }).populate("organisation");

	listing.orgName = listing.organisation.orgName;
	const isOwnerOrg =
		isVerifiedOrg(session) && session?._id === listing.organisation._id + ""; // have to convert because the value on the left is an ObjectId

	const hasAppliedForListing =
		isVerifiedUser(session) &&
		listing.users.some((v: string) => "" + v === session?._id); // same here

	listing = toStrippedObject(listing);

	// loop through the keys and delete them if they are not needed
	Object.entries(listing).forEach(([k, v]) => {
		if (!allowedFields.includes(k)) delete listing[k];
	});

	return {
		props: {
			listing,
			csrfToken: await updateCsrf(context),
			isOwnerOrg,
			hasAppliedForListing,
		}, // will be passed to the page component as props
	};
};
