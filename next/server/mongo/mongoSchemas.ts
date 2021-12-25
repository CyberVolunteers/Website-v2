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
	const schema = constructSchema(deepAssign(listingPublic, listingPrivate));
	// also add a reference to the creator, the users who signed up and coordinates
	schema.add({
		// organisation: { type: Schema.Types.ObjectId, required: true, ref: "Orgs" },
		users: [{ type: Schema.Types.ObjectId, required: true, ref: "Users" }],
		// coords: {
		// 	type: {
		// 		type: String,
		// 		enum: ["Point"],
		// 		required: true,
		// 	},
		// 	coordinates: {
		// 		type: [Number],
		// 		required: true,
		// 	},
		// 	required: false,
		// },
	});

	// text index for text search
	schema.index(
		{
			duration: "text",
			place: "text",
			time: "text",
			skills: "text",
			requirements: "text",
			title: "text",
			desc: "text",
		},
		{
			weights: {
				title: 10,
				desc: 5,
				skills: 3,
				requirements: 3,
			},
		}
	);

	schema.index({
		coords: "2dsphere",
	});

	return schema;
}
