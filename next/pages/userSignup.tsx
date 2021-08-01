import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { csrfFetch } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

export default function UserSignup(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit() {
        const response = await csrfFetch(props, "/api/login", {
            method: "POST",
            credentials: "same-origin", // only send cookies for same-origin requests
            headers: {

                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const resText = await response?.text();

    }

    return <div>
        <p>Hello and welcome to my secure website</p>

        <p>
            <label htmlFor="email">Email</label>
            <input type="email" className="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </p>

        <p>
            <label htmlFor="pwd">Password</label>
            <input className="pwd" name="pwd" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        </p>

        {/* Etc */}

        <button className="submit" type="submit" onClick={onSubmit}>Wow, i sure do trust this website!</button>
    </div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            csrfToken: await updateCsrf(context)
        }, // will be passed to the page component as props
    }
}
