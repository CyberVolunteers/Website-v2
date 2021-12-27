import { flatten, Flattened } from "combined-validator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { ReactElement } from "react";
import { updateCsrf } from "../server/csrf";
import { listings } from "../serverAndClient/publicFieldConstants";

export default function CreateListing({
	csrfToken,
	listingFields,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	return <></>;
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
	listingFields: Flattened;
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
			listingFields: flatten(listings),
		}, // will be passed to the page component as props
	};
};
