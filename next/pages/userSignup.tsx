import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { ReactElement } from "react";
import { users as userFieldSpec } from "../serverAndClient/publicFieldConstants";
import { flatten, Flattened } from "combined-validator";
import { updateCsrf } from "../server/csrf";
import Head from "../client/components/Head";
import { userFieldNamesToShow } from "../serverAndClient/displayNames";
import { Signup } from "../client/components/Signup";

export default function UserSignup(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
): ReactElement {
	// hide "nationality"
	delete props.fields.nationality;

	return (
		<div>
			<Head title="Sign up as a volunteer - cybervolunteers" />

			<p>Hello and welcome to my secure website</p>

			<Signup
				presentableNames={userFieldNamesToShow}
				target="user"
				{...props}
			/>
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
			fields: flatten(userFieldSpec),
		}, // will be passed to the page component as props
	};
};
