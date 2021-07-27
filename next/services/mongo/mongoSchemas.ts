import { constructSchema, deepAssign } from "combined-validator";
import { users as usersPublic, organisations as orgPublic, listings as listingPublic } from "../config/shared/publicFieldConstants"
import { users as usersPrivate, organisations as orgPrivate, listings as listingPrivate } from "../config/server/privateFieldConstants"

export const UserSchema = constructSchema(deepAssign(usersPublic, usersPrivate));
export const OrgSchema = constructSchema(deepAssign(orgPublic, orgPrivate));
export const ListingSchema = constructSchema(deepAssign(listingPublic, listingPublic));
