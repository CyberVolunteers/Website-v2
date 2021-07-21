import { seal, unseal } from "./iron"
import { serialize, parse } from "cookie"
import { NextApiRequest, NextApiResponse } from "next"
import { IncomingMessage } from "http"
import { sessionCookieMaxAge, sessionCookieName } from "../config/shared/config"

export async function getSession(req: NextApiRequest) {
    const sessionCookie = req.cookies?.[sessionCookieName];
    return sessionCookie === undefined ? null : await unseal(sessionCookie);
}

export async function createSession(res: NextApiResponse, data: any) {
    const payload = await seal(data);
    const cookie = serialize(sessionCookieName, payload, {
        maxAge: sessionCookieMaxAge,
        httpOnly: true, // stop the client from accessing the cookie
        sameSite: "strict",
        secure: true,
        path: "/"
    })

    res.setHeader('Set-Cookie', cookie)
}

export function removeSession(res: NextApiResponse) {
    const cookie = serialize(sessionCookieName, '', {
        maxAge: -1,
        path: '/',
    })

    res.setHeader('Set-Cookie', cookie)
}

