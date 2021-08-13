import { constructSchema, deepAssign } from "combined-validator";
import { Schema } from "mongoose";
import { users as usersPublic, organisations as orgPublic, listings as listingPublic } from "../../serverAndClient/publicFieldConstants"
import { users as usersPrivate, organisations as orgPrivate, listings as listingPrivate } from "../privateFieldConstants"

export const UserSchema = constructSchema(deepAssign(usersPublic, usersPrivate));
export const OrgSchema = constructOrgSchema();
export const ListingSchema = constructListingSchema();

function constructOrgSchema(){
	const schema = constructSchema(deepAssign(orgPublic, orgPrivate));
	schema.add({
		listings: [{ type: Schema.Types.ObjectId, ref: "Listings" }]
	})
	return schema
}

function constructListingSchema(){
	const schema = constructSchema(deepAssign(listingPublic, listingPrivate));
	schema.add({
		organisation: { type: Schema.Types.ObjectId, required: true, ref: "Orgs" }
	})
	return schema
}