import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ReactElement } from "react";
import { contactEmail } from "../serverAndClient/staticDetails";
import Head from "../client/components/Head";

export default function ContactUs({
	email,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactElement {
	return (
		<div>
			<Head title="Contact us - cybervolunteers" />
			<p>Please email us at {email}</p>
			{/* Etc */}
		</div>
	);
}

export const getStaticProps: GetStaticProps<{
	email: string;
}> = async () => {
	return {
		props: {
			email: contactEmail,
		},
	};
};
