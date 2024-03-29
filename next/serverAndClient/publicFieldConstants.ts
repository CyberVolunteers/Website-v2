import {
	deepAssign,
	FieldConstraintsCollection,
	filterRules,
	flatten,
} from "combined-validator";
import { categoryNames, expandedCategoryNames } from "../client/utils/const";

export const shortField = 100;
export const mediumField = 500;
export const longField = 2000;
export const extremelyLongField = 10000;
export const emailLengthField = 320;
export const postcodeLengthField = 8;

// client_ prefix means that the option is for the client

// TODO: reformat this to avoid using the same schema for everything (e.g. ajv validator, mongodb schema and others) as it makes everything much more complicated
//TODO: separate into push and pull fields
export const users: FieldConstraintsCollection = {
	required: {
		string: {
			firstName: { maxLength: shortField },
			lastName: { maxLength: shortField },
			email: { maxLength: emailLengthField, client_specialEdit: true },
			password: { client_specialEdit: true },
			address1: { maxLength: shortField },
			postcode: { maxLength: postcodeLengthField },

			city: { maxLength: shortField },
			// assuming it is UK for now
			// country: { maxLength: 56 },
		},
		number: {
			participationNumber: {},
		},
		date: {
			birthDate: {},
		},
	},
	optional: {
		string: {
			gender: { enum: ["m", "f", "o"] },
			occupation: { maxLength: mediumField },
			languages: { maxLength: mediumField },
			skillsAndInterests: { maxLength: longField },
			// nationality: { maxLength: 60 },
			//@ts-ignore
			phoneNumber: { isPhoneNumber: true },

			address2: { maxLength: shortField },
		},
	},
};

export const organisations: FieldConstraintsCollection = {
	required: {
		string: {
			email: { maxLength: emailLengthField, client_specialEdit: true },
			contactEmails: { maxLength: emailLengthField, array: true },
			password: { client_specialEdit: true },
			orgType: { maxLength: shortField },
			orgName: { maxLength: shortField },
			orgDesc: { maxLength: longField },
			//@ts-ignore
			phoneNumber: { isPhoneNumber: true },
		},
	},
	optional: {
		string: {
			orgMission: { maxLength: longField },

			websiteUrl: { maxLength: mediumField },
			twitterLink: { maxLength: mediumField },
			facebookLink: { maxLength: mediumField },
			linkedinLink: { maxLength: mediumField },

			safeguardingLeadEmail: { maxLength: mediumField },
			safeguardingLeadName: { maxLength: mediumField },
			safeguardingPolicyLink: { maxLength: mediumField },
			trainingTypeExplanation: { maxLength: mediumField },

			logoImageName: { maxLength: mediumField },

			city: { maxLength: mediumField },
			postcode: { maxLength: mediumField },

			orgLocation: { maxLength: mediumField },
			address1: { maxLength: mediumField },
			address2: { maxLength: mediumField },
		},
		boolean: {
			isForUnder18: { default: false },
		},
	},
};

export const listings: FieldConstraintsCollection = {
	required: {
		string: {
			duration: { maxLength: longField },
			time: { maxLength: longField },
			skills: { maxLength: longField },
			requirements: { maxLength: extremelyLongField },
			title: { maxLength: shortField },
			desc: { maxLength: extremelyLongField },
			address1: { maxLength: mediumField },
			categories: {
				enum: expandedCategoryNames,
				array: true,
			},
			requiredData: {
				enum: Object.keys(flatten(users)).filter((k) => k !== "password"),
				array: true,
			},
			imagePath: { client_readonly: true },
			uuid: { exactLength: 36, client_readonly: true },
		},
		object: {
			targetAudience: {
				optional: {
					boolean: {
						under16: { default: false },
						between16And18: { default: false },
						between18And55: { default: false },
						over55: { default: false },
					},
				},
			},
		},
		boolean: {
			isFlexible: {},
		},
		number: {
			minHoursPerWeek: {},
			maxHoursPerWeek: { greaterOrEqualTo: "minHoursPerWeek" },
			requestedNumVolunteers: {},
			currentNumVolunteers: { default: 0 },
		},
	},
	optional: {
		string: {
			scrapedOrgName: { maxLength: shortField },
			address2: { maxLength: shortField },
		},
	},
};

export const loginSpec: FieldConstraintsCollection = {
	required: {
		string: {
			email: { maxLength: emailLengthField },
			password: {},
		},
	},
};

function prepareUpdateSpec(
	spec: FieldConstraintsCollection
): FieldConstraintsCollection {
	// deep copy
	// I have no clue why deepAssign is not working in this case
	const newSpec = filterRules(
		JSON.parse(JSON.stringify(spec)),
		["client_specialEdit", "client_readonly"],
		([isSpecialEdit, isReadOnly]: (boolean | undefined)[]) =>
			!(isSpecialEdit === true || isReadOnly == true)
	);

	// Make all optional
	newSpec.optional = deepAssign(newSpec.optional, newSpec.required);
	delete newSpec.required;

	return newSpec;
}

export const userDataUpdateSpec = prepareUpdateSpec(users);

export const orgDataUpdateSpec = prepareUpdateSpec(organisations);

export const listingDataUpdateSpec = prepareUpdateSpec(listings);

// TODO: check that this is correct
// for identification
listingDataUpdateSpec.required = {
	string: {
		uuid: { exactLength: 36 },
	},
};
