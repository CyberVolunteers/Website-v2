import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { updateCsrf } from "../server/csrf";

import Head from "../client/components/Head";
import BackButton from "../client/components/BackButton";
import CustomForm from "../client/components/CustomForm";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { getUserType } from "../server/auth/data";

export default function ForgotPassword({
	csrfToken,
	email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	return (
		<div>
			<Head title="Forgotten password - cybervolunteers" />
			<BackButton text="Password" onClick={() => router.back()} />
			<div className="body-area">
				<CustomForm
					onSubmit={(e) => {
						e.preventDefault();
					}}
					headingText={<span>Forgotten Password</span>}
					subheadingText={`A password reset email has been sent to ${email}. Please follow the instructions in the email to reset your password. `}
				>
					<div style={{ width: "100%", textAlign: "center" }}>
						Didn’t receive an email? We can send you{" "}
						<button
							type="submit"
							style={{
								color: "#f85220",
								cursor: "pointer",
								border: "none",
								backgroundColor: "inherit",
							}}
						>
							a new one.
						</button>
					</div>
				</CustomForm>
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
	email: string | null;
}> = async (context) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	if (typeof session !== "object" || session === null)
		return {
			props: {
				email: null,
				csrfToken: await updateCsrf(context),
			},
		};
	const { isUser, isVerifiedUser } = getUserType(session);
	if (!isVerifiedUser)
		return {
			props: {
				email: null,
				csrfToken: await updateCsrf(context),
			},
		};
	return {
		props: {
			email: session.email,
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
