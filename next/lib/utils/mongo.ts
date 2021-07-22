import { Schema } from "mongoose";

export function copyMongoKeys(schema: Schema, data: object) {
    const out: any = {}

    Object.keys(schema.paths).forEach(k => {
        if (data.hasOwnProperty(k)) out[k] = (data as any)[k]
    })

    return out
}