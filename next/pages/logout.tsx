import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { csrfFetch } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

export default function Logout(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <div>
        Are you sure?

        <button className="submit" type="submit">Sure!</button>
    </div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            csrfToken: await updateCsrf(context)
        }, // will be passed to the page component as props
    }
}
