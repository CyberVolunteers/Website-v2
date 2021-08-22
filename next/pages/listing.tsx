import Image from "next/image";
import { Button, capitalize } from "@material-ui/core";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useState } from "react";
import { ReactElement } from "react";
import Head from "../client/components/Head";
import { getMongo } from "../server/mongo";
import { Listing } from "../server/mongo/mongoModels";
import { toStrippedObject } from "../server/mongo/util";
import { undoCamelCase } from "../client/utils/misc";
import {
  useIsAfterRehydration,
  useViewProtection,
} from "../client/utils/otherHooks";
import { updateCsrf } from "../server/csrf";
import { getSession } from "../server/auth/auth-cookie";
import { isOrg, isUser } from "../server/auth/data";
import { ListingJoinPrompt } from "../client/components/listingJoinPrompt";
import { getAccountInfo } from "../client/utils/userState";

export default function ListingPage({
  listing,
  csrfToken,
  isOwnerOrg,
  hasAppliedForListing,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
  useViewProtection(["org", "user"]);

  const isAfterHydration = useIsAfterRehydration();

  const isOrg = getAccountInfo()?.isOrg;

  const [showVolunteerPopup, setShowVolunteerPopup] = useState(false);

  // TODO: charity edit menu

  const [overallErrors, setOverallErrors] = useState(
    {} as { [key: string]: any }
  );

  return (
    <div>
      <Head title={`${capitalize(listing.title)} - cybervolunteers`} />
      <h1>{capitalize(listing.title)}</h1>

      <div
        className={`img-container`}
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

      <p>
        <span>Description: {listing.desc}</span>
      </p>

      <p>
        volunteers: {listing.currentNumVolunteers}/
        {listing.requestedNumVolunteers}
      </p>

      <p>orgName: {listing.orgName}</p>
      <p>duration: {listing.duration}</p>
      <p>time: {listing.time}</p>
      <p>skills: {listing.skills}</p>
      <p>requirements: {listing.requirements}</p>
      <p>
        targetAudience:{" "}
        {(() => {
          const targetAudience = listing.targetAudience;
          const targetAudienceNameArray = Object.keys(targetAudience).filter(
            (k) => (targetAudience as any)[k] === true
          );
          if (
            targetAudienceNameArray.length === 0 ||
            targetAudienceNameArray.length ===
              Object.keys(targetAudience).length
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
        })()}
      </p>
      <p>location: {JSON.stringify(listing.location)}</p>
      <p>
        {listing.isFlexible ? (
          "The hours are flexible"
        ) : (
          <span>
            The expected hours are between {listing.minHoursPerWeek} and{" "}
            {listing.maxHoursPerWeek}
          </span>
        )}
      </p>

      {/* display on the client */}
      {!isAfterHydration ? null : (
        <>
          {isOrg ? (
            <>
              {isOwnerOrg ? (
                <>
                {/* TODO: allow to edit */}
                <h2>Edit</h2>
                </>
              ) : (
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
    </div>
  );
}

const allowedFields = [
  "imagePath",
  "uuid",
  "currentNumVolunteers",
  "requestedNumVolunteers",
  "requiredData",
  "orgName",
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
    isOrg(session) && session?._id === listing.organisation._id + ""; // have to convert because the value on the left is an ObjectId

  const hasAppliedForListing =
    isUser(session) &&
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
