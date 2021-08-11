import { ListingSchema, OrgSchema, UserSchema } from "./mongoSchemas"
import { model, Schema } from "mongoose"

export const User = getModel("Users", UserSchema);
export const Org = getModel("Orgs", OrgSchema);
export const Listing = getModel("Listings", ListingSchema);

function getModel(name: string, schema: Schema) {
    try {
        return model(name);
    } catch {
        return model(name, schema)
    }
}