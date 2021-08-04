import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { activateViewProtection as useViewProtection, csrfFetch } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

export default function ManageListings({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    useViewProtection(["org"]);

    function createListing() {

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
