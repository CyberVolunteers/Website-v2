import { ListingSchema, OrgSchema, UserSchema } from "./mongoSchemas"
import { model, Schema } from "mongoose"

export const User = getModel("users", UserSchema);
export const Org = getModel("orgs", OrgSchema);
export const Listing = getModel("listings", ListingSchema);

function getModel(name: string, schema: Schema) {
    try {
        return model(name);
    } catch {
        return model(name, schema)
    }
}