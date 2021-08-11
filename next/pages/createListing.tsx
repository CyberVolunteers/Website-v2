import { flatten, Flattened } from "combined-validator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { ReactElement, useRef, useState } from "react";
import FormFieldCollection from "../client/components/FormFieldCollection";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { useViewProtection } from "../client/utils/otherHooks";
import { csrfFetch, updateCsrf } from "../serverAndClient/csrf";
import { listings } from "../serverAndClient/publicFieldConstants";
import Head from "../client/components/Head";
import { listingFieldNamesToShow } from "../serverAndClient/displayNames";
import { PerElementValidatorCallbacks } from "../client/components/FormComponent";
import FormFieldCollectionErrorHeader from "../client/components/FormFieldCollectionErrorHeader";


export default function CreateListing({ csrfToken, listingFields }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org"]);

	const autoFormRef = useRef();

	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

	const perElementValidationCallbacks: PerElementValidatorCallbacks = {
	};

	async function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const data: { [key: string]: any } | null = (autoFormRef.current as any)?.getData();


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

		<form onSubmit={onSubmit}>
			<FormFieldCollectionErrorHeader overallErrors={overallErrors} />
			<FormFieldCollection ref={autoFormRef} fields={listingFields} presentableNames={listingFieldNamesToShow} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} />
			<button className="submit" type="submit">click me</button>
		</form>

	</div>;
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string,
	listingFields: Flattened
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
			listingFields: flatten(listings)
		}, // will be passed to the page component as props
	};
};
