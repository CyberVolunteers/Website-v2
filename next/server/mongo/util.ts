// eslint-disable-next-line
//@ts-ignore
import ObjectId from "mongoose/lib/types/objectid";
import { ListingType } from "../../pages/searchListings";

// NOTE: Removes some unwanted keys, but do double-check them!
export function toStrippedObject(obj: any) {
	return obj.toJSON({
		versionKey: false,
		transform: (doc: any, out: any) => {
			Object.keys(out).forEach((k) => {
				if (out[k] instanceof ObjectId) delete out[k]; // delete all the id keys
				if (k[0] === "_") delete out[k]; // delete all the underscore keys
				if (out[k] instanceof Date) out[k] = out[k].toISOString(); // delete all the id keys
			});
			return out;
		},
	});
}

export function getCleanListingData(l: any) {
	const out: ListingType = {
		duration: l.duration,
		time: l.time,
		skills: l.skills,
		requirements: l.requirements,
		title: l.title,
		desc: l.desc,
		categories: l.categories,
		// requiredData: {
		// 	enum: Object.keys(flatten(users)).filter((k) => k !== "password"),
		// 	array: true,
		// },
		imagePath: l.imagePath,
		uuid: l.uuid,
		targetAudience: {
			under16: l.targetAudience.under16,
			between16And18: l.targetAudience.between16And18,
			between18And55: l.targetAudience.between18And55,
			over55: l.targetAudience.over55,
		},
		isFlexible: l.isFlexible,
		minHoursPerWeek: l.minHoursPerWeek,
		maxHoursPerWeek: l.maxHoursPerWeek,
		requestedNumVolunteers: l.requestedNumVolunteers,
		currentNumVolunteers: l.currentNumVolunteers,

		organisation: {
			contactEmails: l.organisation.contactEmails,
			isOrganisationVerified: l.organisation.isOrganisationVerified,
			hasSafeguarding: l.organisation.hasSafeguarding,
			listings: l.organisation.listings,
			type: l.organisation.orgType,
			name: l.organisation.orgName,
			desc: l.organisation.orgDesc,
			location: l.organisation.orgLocation,
			phoneNumber: l.organisation.phoneNumber,
			creds: l.organisation.creds.map((c: any) => ({
				email: c.email,
				passwordHash: c.passwordHash,
			})),
		},

		address1: l.address1,
	};

	if (typeof l.scrapedOrgName === "string") {
		out.scrapedOrgName = l.scrapedOrgName;
	}

	if (typeof l.address2 === "string") {
		out.address2 = l.address2;
	}

	return out;
}
