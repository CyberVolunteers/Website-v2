import { createAjvJTDSchema, flatten, Flattened } from "combined-validator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { ReactElement, useState } from "react";
import AutoConstructedForm, { PerElementValidatorCallbacks } from "../client/components/AutoCostructedForm";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { useViewProtection } from "../client/utils/otherHooks";
import { csrfFetch, updateCsrf } from "../serverAndClient/csrf";
import { listings, listings as listingsFields } from "../serverAndClient/publicFieldConstants";
import Head from "../client/components/Head";
import { listingFieldNamesToShow } from "../serverAndClient/displayNames";
import Ajv from "ajv/dist/jtd";


export default function CreateListing({ csrfToken, listingFields }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org"]);

	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

	const perElementValidationCallbacks: PerElementValidatorCallbacks = {
	};

	async function onSubmit(evt: React.FormEvent<HTMLFormElement>, data: {
		[key: string]: any;
	}) {
		const res = await csrfFetch(csrfToken, "/api/createListing", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {

				"content-type": "application/json",
				"accept": "application/json",
			},
			body: JSON.stringify(data)
		});

		if (!await updateOverallErrorsForRequests(res, "createListingPost", overallErrors, setOverallErrors)) return;
	}

	return <div>
		<Head title="Create a listing - cybervolunteers" />

		<AutoConstructedForm fields={listingFields} presentableNames={listingFieldNamesToShow} onSubmit={onSubmit} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} />

	</div>;
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string,
	listingFields: Flattened
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
			listingFields: flatten(listingsFields)
		}, // will be passed to the page component as props
	};
};
