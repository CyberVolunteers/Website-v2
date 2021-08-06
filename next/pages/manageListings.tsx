import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";
import { useViewProtection } from "../client/utils/otherHooks";
import { updateCsrf } from "../serverAndClient/csrf";

export default function ManageListings({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org"]);

	// it will be implemented in the future
	// eslint-disable-next-line
	function createListing() {}

	return <div>
		<h1>Don&#39;t go crazy with your power!</h1>

		<button className="submit" type="submit" onClick={createListing}>We need more listings!!</button>
	</div>;
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string,
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context)
		}, // will be passed to the page component as props
	};
};
