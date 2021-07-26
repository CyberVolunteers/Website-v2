import { useState } from "react";

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");





    async function onSubmit() {
        const response = await fetch("/api/hello", {
            method: "POST",
            credentials: "same-origin", // only send cookies for same-origin requests
            "headers": {

                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        });
    }

    return <div>
        Hello and welcome to my secure website
        <br />

        <label htmlFor="email">Email</label>
        <input className="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>

        <br />

        <label htmlFor="pwd">Password</label>
        <input className="pwd" name="pwd" value={password} onChange={(e) => setPassword(e.target.value)}></input>

        <br />

        <button className="submit" type="submit" onClick={onSubmit}>Wow, i sure do trust this website!</button>
    </div>
}