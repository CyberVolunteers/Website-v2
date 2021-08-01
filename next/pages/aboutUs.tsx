import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { csrfFetch } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

export default function AboutUs() {
    return <div>
        <p>We are doing stuff</p>

        {/* Etc */}
    </div>
}
