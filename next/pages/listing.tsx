import Image from "next/image";
import { Button, capitalize, CircularProgress } from "@material-ui/core";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useRef, useState } from "react";
import { ReactElement } from "react";
import Head from "../client/components/Head";
import { getMongo } from "../server/mongo";
import { Listing } from "../server/mongo/mongoModels";
import { toStrippedObject } from "../server/mongo/util";
import {
  undoCamelCase,
  updateOverallErrorsForRequests,
} from "../client/utils/misc";
import { getAccountInfo } from "../client/utils/userState";
import {
  useIsAfterRehydration,
  useViewProtection,
} from "../client/utils/otherHooks";
import FormFieldCollection from "../client/components/FormFieldCollection";
import { userFieldNamesToShow } from "../serverAndClient/displayNames";
import { users } from "../serverAndClient/publicFieldConstants";
import isMobilePhone from "validator/lib/isMobilePhone";
import FormFieldCollectionErrorHeader from "../client/components/FormFieldCollectionErrorHeader";
import { flatten, Flattened } from "combined-validator";
import { csrfFetch } from "../client/utils/csrf";
import { updateCsrf } from "../server/csrf";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";

export default function ListingPage({
  listing,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
  useViewProtection(["org", "user"]);

  const router = useRouter();

  const [showVolunteerPopup, setShowVolunteerPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // do not update this value after the initial render
  const [missingFieldStructure, setMissingFieldStructure] = useState(
    {} as Flattened
  );

  useEffect(() => {
    const missingFields = getAccountInfo()?.missingFields ?? [];
    const requiredMissingFields = listing.requiredData.filter(
      (v) => missingFields.includes(v) // not terribly efficient, but there are not many fields
    );
    // get only the required fields, but set them to "required"
    setMissingFieldStructure(
      Object.fromEntries(
        requiredMissingFields.map((k) => {
          const v = flatten(users)[k];
          v.required = true; // make them all required
          return [k, v];
        })
      )
    );
  }, []);

  const missingFieldsRef = useRef();

  // TODO: charity edit menu

  const [overallErrors, setOverallErrors] = useState(
    {} as { [key: string]: any }
  );

  async function wantToHelpFormSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    if (isLoading) return; // do not submit the form twice in a row

    const dataRef = missingFieldsRef.current as any;
    const data: { [key: string]: any } | null = dataRef?.getData();

    if (data === null) return;

    setIsLoading(true);

    // if there is data to be updated, do that
    if (data !== undefined) {
      const res = await csrfFetch(csrfToken, `/api/updateUserData`, {
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
          `listingUserUpdateData`,
          overallErrors,
          setOverallErrors
        ))
      )
        return setIsLoading(false);
    }

    // do the actual sign-up
    const res = await csrfFetch(csrfToken, `/api/joinListing`, {
      method: "POST",
      credentials: "same-origin", // only send cookies for same-origin requests
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ uuid: listing.uuid }),
    });
    if (
      !(await updateOverallErrorsForRequests(
        res,
        `listingJoin`,
        overallErrors,
        setOverallErrors
      ))
    )
      return setIsLoading(false);

    setIsLoading(false);

    router.push("/listingJoinSuccess");
  }

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

      {/* TODO: separate into a different component */}
      {/* The popup shown after the user clicks on "i want to help" button */}
      {showVolunteerPopup ? (
        <div>
          <form onSubmit={wantToHelpFormSubmit}>
            <h2>
              (Totally a popup) Hey, are you sure you want to sign up for this
              opportunity?
            </h2>
            <FormFieldCollectionErrorHeader
              overallErrors={overallErrors}
            ></FormFieldCollectionErrorHeader>
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
              if (Object.keys(missingFieldStructure).length === 0) return null;

              return (
                <>
                  <h3>
                    We do not have some information about you that is required
                    by this charity:
                  </h3>
                  <FormFieldCollection
                    ref={missingFieldsRef}
                    fields={missingFieldStructure}
                    presentableNames={userFieldNamesToShow}
                    perElementValidationCallbacks={{
                      phoneNumber: (v: string) => isMobilePhone(v),
                    }}
                    overallErrors={overallErrors}
                    setOverallErrors={setOverallErrors}
                  />
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

      {isLoading ? <CircularProgress /> : null}
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
  csrfToken: string;
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
      csrfToken: await updateCsrf(context),
    }, // will be passed to the page component as props
  };
};
