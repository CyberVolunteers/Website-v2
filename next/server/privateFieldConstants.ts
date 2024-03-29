import { FieldConstraintsCollection } from "combined-validator";
import { mediumField } from "../serverAndClient/publicFieldConstants";

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
			// @ts-ignore
			email: undefined,
			// @ts-ignore
			password: undefined, // delete the password field from server-side usage
		},
		boolean: {
			isOrganisationVerified: { default: false },
		},
		object: {
			creds: {
				array: true,
				required: {
					string: {
						// @ts-ignore
						email: { maxLength: 320, index: true },
						passwordHash: { exactLength: 60 },
					},
					boolean: {
						isEmailVerified: { default: false },
					},
				},
				optional: {
					string: {
						firstName: { maxLength: mediumField },
						lastName: { maxLength: mediumField },
					},
				},
			},
		},
	},
};

export const listings: FieldConstraintsCollection = {
	required: {
		date: {
			createdDate: {},
		},
	},
};
