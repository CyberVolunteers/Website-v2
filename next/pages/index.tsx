import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { csrfFetch } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

export default function Home() {
    return <div>
        <p>We are the Cybervolunteers and this is our home page</p>

        {/* Etc */}
    </div>
}
