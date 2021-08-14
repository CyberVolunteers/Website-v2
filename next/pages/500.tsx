import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import React, { ReactElement } from "react";
import Head from "../client/components/Head";
import { contactEmail } from "../serverAndClient/staticDetails";

export default function Error500({email}: InferGetStaticPropsType<typeof getStaticProps>): ReactElement {
	return <div>
		<Head title="Server error - cybervolunteers" />
		<h1>We are sorry, something went wrong</h1>

		<p>Please email us at {email} and tell us what led to this issue</p>

		<Link href="/" passHref>
			<a>
				<p>
					Back to the home page!
				</p>
			</a>
		</Link>
	</div>;
}

export const getStaticProps: GetStaticProps<{
	email: string
}> = async () => {
	return {
		props: {
			email: contactEmail
		}
	}
}