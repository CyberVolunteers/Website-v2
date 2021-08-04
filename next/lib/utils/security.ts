import { randomBytes } from "crypto";
import { GetServerSidePropsContext } from "next";
import { updateSession } from "../../services/auth/auth-cookie";
import { csrfTokenLength } from "../../config/server/sentMetadata";

export function mergeWithCallback<T>(val: T, callback: (k: string, v: T) => [k: string, v: T]) {
    if ((val as any).constructor?.name !== "object" && !Array.isArray(val)) return val // check if we want to recurse

    const out: any = (val instanceof Array) ? [] : {};
    Object.entries(val).forEach(([k, v]) => {
        const [newK, newV] = callback(k, v);
        out[newK] = mergeWithCallback(newV, callback);
    })

    return out as T
}

function trimDollarSigns(val: string) {
    while (val.length !== 0 && val.charAt(0) === "$") {
        val = val.substring(1);
    }
    return val
}

export function sanitiseForMongo<T>(val: T) {
    if (typeof val !== "object" || val === null) return val
    const out: any = (val instanceof Array) ? [] : {};
    Object.entries(val).forEach(([k, entry]) => {
        out[trimDollarSigns(k)] = sanitiseForMongo(entry);
    })

    return out as T
}

export function genRandomToken(length: number) {
    return randomBytes(Math.floor(length / 2)).toString("hex");
}

export async function updateCsrf(context: GetServerSidePropsContext<any>) {
    const newToken = genRandomToken(csrfTokenLength);
    const additionalSessionEntries: any = {};

    let index = context.resolvedUrl.indexOf("?");
    if (index === -1) index = context.resolvedUrl.length
    const simpleUrl = context.resolvedUrl.substr(0, index);

    additionalSessionEntries.csrfToken = {};
    additionalSessionEntries.csrfToken[simpleUrl] = newToken;

    await updateSession(context.req as any, context.res as any, additionalSessionEntries);
    return newToken;
}