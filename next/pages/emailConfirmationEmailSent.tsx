import { useViewerType } from "../client/utils/userState";
import Head from "../client/components/Head";
import Link from "next/link";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ExtendedNextApiRequest } from "../server/types";
import { getSession } from "../server/auth/auth-cookie";
import { ReactElement } from "react";
import { sendEmailConfirmationEmail } from "../server/email/emailConfirm";
import { isLoggedIn, isVerified } from "../server/auth/data";
import { useViewProtection } from "../client/utils/otherHooks";

export default function EmailConfirmationEmailSent({}: InferGetServerSidePropsType<
	typeof getServerSideProps
>): ReactElement {
	useViewProtection(["unverified_org", "unverified_user", "org", "user"]);
	const viewerType = useViewerType();

	return (
		<div>
			<Head title="Verification email sent - cybervolunteers" />

			{viewerType === "unverified_user" || viewerType === "unverified_org" ? (
				<>
					<h1>The verification email has been sent</h1>
					<h2>Please check your email</h2>
				</>
			) : (
				<>
					<h1>Your email has been verified already.</h1>
					<div>
						Feel free to tweak{" "}
						<Link href="/myAccount" passHref>
							<a>your account</a>
						</Link>{" "}
						or to{" "}
						<Link href="/searchListings" passHref>
							<a>look at some listings</a>
						</Link>
					</div>
				</>
				// TODO: add a button to resend = refresh
			)}
		</div>
	);
}
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	const email = session?.email; //TODO: replace the email
	if (typeof email === "string" && isLoggedIn(session) && !isVerified(session))
		sendEmailConfirmationEmail(email);

	return {
		props: {}, // will be passed to the page component as props
	};
};
