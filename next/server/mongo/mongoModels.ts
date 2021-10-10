import { ListingSchema, OrgSchema, UserSchema } from "./mongoSchemas";
import { model, Schema } from "mongoose";

export const User = getModel("Users", UserSchema);
export const Org = getModel("Orgs", OrgSchema);
export const Listing = getModel("Listings", ListingSchema);

/**
 * Only gets the model if it hasn't been registered already (mostly used for reloads in dev version)
 * @param name the name of the new model
 * @param schema schema used to create a model
 * @returns
 */
function getModel(name: string, schema: Schema) {
	try {
		return model(name);
	} catch {
		return model(name, schema);
	}
}
