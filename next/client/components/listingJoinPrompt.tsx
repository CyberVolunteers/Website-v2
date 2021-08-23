import { Button, capitalize, CircularProgress } from "@material-ui/core";
import { Flattened, flatten } from "combined-validator";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import isMobilePhone from "validator/lib/isMobilePhone";
import { ListingPageListingData } from "../../pages/listing";
import { userFieldNamesToShow } from "../../serverAndClient/displayNames";
import { users } from "../../serverAndClient/publicFieldConstants";
import { csrfFetch } from "../utils/csrf";
import { undoCamelCase, updateOverallErrorsForRequests } from "../utils/misc";
import { getAccountInfo } from "../utils/userState";
import FormFieldCollection from "./FormFieldCollection";
import FormFieldCollectionErrorHeader from "./FormFieldCollectionErrorHeader";
import { getSignupPerElementValidationCallbacks } from "./Signup";

export function ListingJoinPrompt({
  csrfToken,
  listing,
  overallErrors,
  setOverallErrors,
}: {
  csrfToken: string;
  listing: ListingPageListingData;
  overallErrors: {
    [key: string]: any;
  };
  setOverallErrors: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;
}): ReactElement {
  const router = useRouter();
  const missingFieldsRef = useRef();

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
    <>
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
              This organisation will be able to see this information about you:
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
                  We do not have some information about you that is required by
                  this charity:
                </h3>
                <FormFieldCollection
                  ref={missingFieldsRef}
                  fields={missingFieldStructure}
                  presentableNames={userFieldNamesToShow}
                  perElementValidationCallbacks={getSignupPerElementValidationCallbacks(
                    overallErrors,
                    setOverallErrors
                  )}
                  overallErrors={overallErrors}
                  setOverallErrors={setOverallErrors}
                />
              </>
            );
          })()}

          <button type="submit">Sell my soul to the devil!</button>
        </form>
      </div>

      {isLoading ? <CircularProgress /> : null}
    </>
  );
}
