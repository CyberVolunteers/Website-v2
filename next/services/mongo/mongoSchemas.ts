import { constructSchema } from "combined-validator/dist/mongo";
import { users as usersPublic, organisations as orgPublic, listings as listingPublic } from "../config/shared/publicFieldConstants"
import { users as usersPrivate, organisations as orgPrivate, listings as listingPrivate } from "../config/server/privateFieldConstants"

export const UserSchema = constructSchema(usersPublic, usersPrivate);
export const OrgSchema = constructSchema(orgPublic, orgPrivate);
export const ListingSchema = constructSchema(listingPublic, listingPublic);