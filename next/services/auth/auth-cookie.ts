import { seal, unseal } from "./iron"
import { serialize, parse } from "cookie"
import { NextApiRequest, NextApiResponse } from "next"
import { IncomingMessage } from "http"
import { isSessionActiveCookieName, sessionCookieMaxAge, sessionCookieName } from "../config/shared/config"

export async function getSession(req: NextApiRequest) {
    const sessionCookie = req.cookies?.[sessionCookieName];
    let sealed;
    try {
        sealed = await unseal(sessionCookie)
    } catch (err) {
        return null;
    }
    return sessionCookie === undefined ? null : sealed;
}

export const refreshSession = async function createSession(res: NextApiResponse, data: any) {
    const payload = await seal(data);
    const sessionCookie = serialize(sessionCookieName, payload, {
        maxAge: sessionCookieMaxAge,
        httpOnly: true, // stop the client from accessing the cookie
        sameSite: "strict",
        secure: true,
        path: "/"
    })
    const isSessionActiveCookie = serialize(isSessionActiveCookieName, "true", {
        maxAge: sessionCookieMaxAge,
        sameSite: "strict",
        secure: true,
        path: "/"
    })


    res.setHeader('Set-Cookie', [sessionCookie, isSessionActiveCookie])
}

export function removeSession(res: NextApiResponse) {
    const emptyCookieSettings = {
        maxAge: -1,
        path: '/',
    }
    const sessionCookie = serialize(sessionCookieName, '', emptyCookieSettings)
    const isSessionActiveCookie = serialize(isSessionActiveCookieName, '', emptyCookieSettings)

    res.setHeader('Set-Cookie', [sessionCookie, isSessionActiveCookie])
}

