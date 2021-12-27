import { constructSchema, deepAssign } from "combined-validator";
import { Schema } from "mongoose";
import {
	users as usersPublic,
	organisations as orgPublic,
	listings as listingPublic,
} from "../../serverAndClient/publicFieldConstants";
import {
	users as usersPrivate,
	organisations as orgPrivate,
	listings as listingPrivate,
} from "../privateFieldConstants";

export const UserSchema = constructUserSchema();
export const OrgSchema = constructOrgSchema();
export const ListingSchema = constructListingSchema();

function constructUserSchema() {
	const schema = constructSchema(deepAssign(usersPublic, usersPrivate));

	return schema;
}
function constructOrgSchema() {
	const schema = constructSchema(deepAssign(orgPublic, orgPrivate));
	// also add a list of listings
	schema.add({
		listings: [{ type: Schema.Types.ObjectId, ref: "Listings" }],
	});
	return schema;
}

function constructListingSchema() {
	const pointSchema = new Schema({
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	});
	const schema = constructSchema(deepAssign(listingPublic, listingPrivate));
	// also add a reference to the creator, the users who signed up and coordinates
	schema.add({
		organisation: { type: Schema.Types.ObjectId, required: true, ref: "Orgs" },
		users: [{ type: Schema.Types.ObjectId, required: true, ref: "Users" }],
		coords: {
			type: pointSchema,
			required: false,
			index: "2dsphere",
		},
	});

	// text index for text search
	schema.index(
		{
			duration: "text",
			address1: "text",
			time: "text",
			skills: "text",
			requirements: "text",
			title: "text",
			desc: "text",
		},
		{
			weights: {
				title: 5,
				desc: 3,
				skills: 2,
				requirements: 2,
			},
		}
	);

	return schema;
}
