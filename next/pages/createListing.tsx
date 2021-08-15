import { flatten, Flattened } from "combined-validator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { ReactElement, useRef, useState } from "react";
import FormFieldCollection from "../client/components/FormFieldCollection";
import { updateOverallErrorsForRequests } from "../client/utils/misc";
import { useViewProtection } from "../client/utils/otherHooks";
import { updateCsrf } from "../server/csrf";
import { csrfFetch } from "../client/utils/csrf";
import { listings } from "../serverAndClient/publicFieldConstants";
import Head from "../client/components/Head";
import { listingFieldNamesToShow } from "../serverAndClient/displayNames";
import { PerElementValidatorCallbacks } from "../client/components/FormComponent";
import FormFieldCollectionErrorHeader from "../client/components/FormFieldCollectionErrorHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useRouter } from "next/dist/client/router";
import { isNonNegative } from "../serverAndClient/validation";
import { addError } from "../client/utils/formUtils";


export default function CreateListing({ csrfToken, listingFields }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org"]);

	const fieldsToDisplay = Object.assign({}, listingFields);
	delete fieldsToDisplay.imagePath;
	delete fieldsToDisplay.uuid;

	const router = useRouter();

	const autoFormRef = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const listingImageInputRef = useRef<HTMLInputElement>(null);

	const [overallErrors, setOverallErrors] = useState({} as {
		[key: string]: string
	});

	const perElementValidationCallbacks: PerElementValidatorCallbacks = {
		minHoursPerWeek: isNonNegative,
		maxHoursPerWeek: isNonNegative,
		requestedNumVolunteers: isNonNegative,
	};

	async function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		if (isLoading) return; // do not submit the form twice in a row

		
		
		// the file is a requirement
		const file = listingImageInputRef.current?.files?.[0];
		if (!file) return addError(overallErrors, setOverallErrors, "createListingImageFileUpload", "Please select an image for your listing.");
		
		const data: { [key: string]: any } | null = (autoFormRef.current as any)?.getData();
		if (data === null) return;
		
		if (data.minHoursPerWeek > data.maxHoursPerWeek) return addError(overallErrors, setOverallErrors, "createListingMaxAndMinHoursComparison", "Please make sure that the minimum number of hours of volunteering is not greater than the maximum.");
		
		const formData = new FormData();
		Object.entries(data).forEach(([k, v]) => formData.append(k, JSON.stringify(v)));
		formData.append("listingImage", file);
		
		setIsLoading(true);
		const res = await csrfFetch(csrfToken, "/api/createListing", {
			method: "POST",
			credentials: "same-origin", // only send cookies for same-origin requests
			headers: {
				"accept": "application/json",
			},
			body: formData
		});
		
		setIsLoading(false);
		if (!await updateOverallErrorsForRequests(res, "createListingPost", overallErrors, setOverallErrors)) return;
		router.push("/manageListings");
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
