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
import CircularProgress from "@material-ui/core/CircularProgress";


export default function CreateListing({ csrfToken, listingFields }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org"]);
	
	const fieldsToDisplay = Object.assign({}, listingFields);
	delete fieldsToDisplay.imagePath;
	delete fieldsToDisplay.uuid;
	
	const autoFormRef = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const listingImageInputRef = useRef<HTMLInputElement>(null);

	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

	const perElementValidationCallbacks: PerElementValidatorCallbacks = {
	};

	async function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		if(isLoading) return; // do not submit the form twice in a row

		setIsLoading(true);

		const file = listingImageInputRef.current?.files?.[0];
		if (!file) {
			const overallErrorsCopy = Object.assign({}, overallErrors);
			overallErrorsCopy["createListingImageFileUpload"] = "Please select an image for your listing.";
			setOverallErrors(overallErrorsCopy);
			return;
		}

		const data: { [key: string]: any } | null = (autoFormRef.current as any)?.getData();
		if (data === null) return;
		const formData = new FormData();
		Object.entries(data).forEach(([k, v]) => formData.append(k, JSON.stringify(v))); // also remove the quotes when needed so that a string "dsafadf" does not become "\"dsafadf\""
		formData.append("listingImage", file);

		const res = await csrfFetch(csrfToken, "/api/createListing", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"accept": "application/json",
			},
			body: formData
		});

		if (!await updateOverallErrorsForRequests(res, "createListingPost", overallErrors, setOverallErrors)) return;
		setIsLoading(false);
	}

	return <div>
		<Head title="Create a listing - cybervolunteers" />

		<form onSubmit={onSubmit}>
			<FormFieldCollectionErrorHeader overallErrors={overallErrors} />
			<FormFieldCollection ref={autoFormRef} fields={fieldsToDisplay} presentableNames={listingFieldNamesToShow} perElementValidationCallbacks={perElementValidationCallbacks} overallErrors={overallErrors} setOverallErrors={setOverallErrors} />

			<p>
				<label htmlFor="listing-img-upload">Can i haz image please? (required)</label>
				<input type="file" name="listing-img-upload" ref={listingImageInputRef} onChange={() => setOverallErrors({})}></input>
			</p>
			<p><button className="submit" type="submit">Create a listing!</button></p>
			{
				isLoading ?
					<CircularProgress /> :
					null
			}
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
