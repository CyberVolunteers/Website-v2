import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { csrfFetch, updateLoginState } from "../lib/client/util";
import { updateCsrf } from "../lib/utils/security";

export default function Login({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit() {
        const response = await csrfFetch(csrfToken, "/api/login", {
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
        updateLoginState() // not in an if statement so that we don't miss it if the error code was not checked for
        const resText = await response?.text();
    }

    return <div>
        Hello and welcome to my secure website
        <br />

        <label htmlFor="email">Email</label>
        <input type="email" className="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>

        <br />

        <label htmlFor="pwd">Password</label>
        <input className="pwd" name="pwd" value={password} onChange={(e) => setPassword(e.target.value)}></input>

        <br />

        <button className="submit" type="submit" onClick={onSubmit}>Wow, i sure do trust this website!</button>
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
