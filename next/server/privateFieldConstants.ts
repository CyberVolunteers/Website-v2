import { FieldConstraintsCollection } from "combined-validator";

// NOTE: this file works together with ../shared/publicFieldConstants.ts!

export const users: FieldConstraintsCollection = {
	required: {
		string: {
			email: { unique: true },
			// @ts-ignore
			password: undefined, // delete the password field from server-side usage
			passwordHash: { exactLength: 60 },
		},
	},
	optional: {
		number: {
			adminLevel: { default: 0 },
		},
		boolean: {
			isEmailVerified: { default: false },
		},
	},
};

export const organisations: FieldConstraintsCollection = {
	required: {
		string: {
			email: { unique: true },
			// @ts-ignore
			password: undefined, // delete the password field from server-side usage
			passwordHash: { exactLength: 60 },
		},
		boolean: {
			isEmailVerified: { default: false },
			isOrganisationVerified: { default: false },
		},
	},
};

export const listings: FieldConstraintsCollection = {
	required: {
		number: {
			currentNumVolunteers: { default: 0 },
		},
		date: {
			createdDate: {},
		},
	},
};
