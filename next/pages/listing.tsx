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
import { getAccountInfo } from "../client/utils/userState";
import { useViewProtection } from "../client/utils/otherHooks";

export default function ListingPage({
  listing,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
  useViewProtection(["org", "user"]);
  const [showVolunteerPopup, setShowVolunteerPopup] = useState(false);

  const missingFields = getAccountInfo()?.missingFields ?? [];
  const requiredMissingFields = listing.requiredData.filter((v) =>
    missingFields.includes(v)
  );

  // TODO: charity edit menu
  const [volunteerFormFieldValues, setVolunteerFormFieldValues] = useState({});

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

      {/* The popup shown after the user clicks on "i want to help" button */}
      {showVolunteerPopup ? (
        <div>
          <form>
            <h2>
              (Totally a popup) Hey, are you sure you want to sign up for this
              opportunity?
            </h2>
            {listing.requiredData.length > 0 ? (
              <h3>
                This organisation will be able to see this information about
                you:
              </h3>
            ) : null}
            {listing.requiredData.map((v) => (
              <p key={v}>{capitalize(undoCamelCase(v))}</p>
            ))}

            {/* Get missing fields */}
            {(() => {
              if (requiredMissingFields.length === 0) return null;

              return (
                <>
                  <h3>
                    We do not have some information about you that is required
                    by this charity:
                  </h3>
                  {requiredMissingFields.map((v, i) => (
                    <span key={i}>
                      <label htmlFor={`missing-fields-${v}`}>
                        {capitalize(undoCamelCase(v))}
                      </label>
                      <input id={`missing-fields-${v}`}></input>
                    </span>
                  ))}
                </>
              );
            })()}

            <button type="submit">Sell my soul to the devil!</button>
          </form>
        </div>
      ) : null}

      <Button onClick={() => setShowVolunteerPopup(!showVolunteerPopup)}>
        <p>want to help</p>
      </Button>
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

export const getServerSideProps: GetServerSideProps<{
  listing: {
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
}> = async (context) => {
  const uuid = context.query.uuid;
  if (typeof uuid !== "string")
    return {
      notFound: true,
      props: {},
    };

  await getMongo(); // connect
  const listing = toStrippedObject(
    (await Listing.find({ uuid }).populate("organisation"))[0]
  ); // TODO: maybe try aggregate? some people say it's faster

  listing.orgName = listing.organisation.orgName;

  // loop through the keys and delete them if they are not needed
  Object.entries(listing).forEach(([k, v]) => {
    if (!allowedFields.includes(k)) delete listing[k];
  });

  return {
    props: {
      listing,
    }, // will be passed to the page component as props
  };
};
