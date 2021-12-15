import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";
import { organisations as organisationsFieldSpec } from "../serverAndClient/publicFieldConstants";
import { flatten, Flattened } from "combined-validator";
import { updateCsrf } from "../server/csrf";
import Head from "../client/components/Head";
import { orgFieldNamesToShow } from "../serverAndClient/displayNames";
import React from "react";

export default function OrganisationSignup(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
): ReactElement {
	delete props.fields.contactEmails;
	delete props.fields.hasSafeguarding;
	return (
		<div>
			<Head title="Organisation sign up - cybervolunteers" />

			<p>Hello and welcome to my secure website</p>

			<Signup presentableNames={orgFieldNamesToShow} target="org" {...props} />
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
	fields: Flattened;
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
			fields: flatten(organisationsFieldSpec),
		}, // will be passed to the page component as props
	};
};
