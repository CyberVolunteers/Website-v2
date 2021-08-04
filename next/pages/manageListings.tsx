import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { activateViewProtection, csrfFetch } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

export default function ManageListings({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if (!activateViewProtection(["org"])) return null; // prevent the rest from being executed so that the unloaded component doesn't get updated

    async function createListing() {

    }

    return <div>
        <h1>Don't go crazy with your power!</h1>

        <button className="submit" type="submit" onClick={createListing}>We need more listings!!</button>
    </div>
}

export const getServerSideProps: GetServerSideProps<{
    csrfToken: string,
}> = async (context) => {
    return {
        props: {
            csrfToken: await updateCsrf(context)
        }, // will be passed to the page component as props
    }
}
