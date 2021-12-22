import {
	deepAssign,
	FieldConstraintsCollection,
	filterRules,
	flatten,
} from "combined-validator";

// client_ prefix means that the option is for the client

//TODO: separate into push and pull fields
export const users: FieldConstraintsCollection = {
	required: {
		string: {
			firstName: { maxLength: 30 },
			lastName: { maxLength: 30 },
			email: { maxLength: 320, client_specialEdit: true },
			password: { client_specialEdit: true },
			address1: { maxLength: 100 },
			postcode: { maxLength: 8 },

			city: { maxLength: 85 },
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
			occupation: { maxLength: 200 },
			languages: { maxLength: 200 },
			skillsAndInterests: { maxLength: 1000 },
			// nationality: { maxLength: 60 },
			//@ts-ignore
			phoneNumber: { isPhoneNumber: true },

			address2: { maxLength: 100 },
		},
	},
};

export const organisations: FieldConstraintsCollection = {
	required: {
		string: {
			email: { maxLength: 320, client_specialEdit: true },
			contactEmails: { maxLength: 320, array: true },
			password: { client_specialEdit: true },
			orgType: { maxLength: 60 },
			orgName: { maxLength: 150 },
			orgDesc: { maxLength: 5000 },
			orgLocation: { maxLength: 150, client_specialEdit: true },
			//@ts-ignore
			phoneNumber: { isPhoneNumber: true },
		},
	},
	optional: {
		string: {
			websiteUrl: { maxLength: 100 },
		},
		boolean: {
			hasSafeguarding: { default: false },
		},
	},
};

export const listings: FieldConstraintsCollection = {
	required: {
		string: {
			duration: { maxLength: 1000 },
			time: { maxLength: 1000 },
			skills: { maxLength: 3000 },
			requirements: { maxLength: 3000 },
			title: { maxLength: 150 },
			desc: { maxLength: 7000 },
			category: {
				enum: [
					"Advocacy & Human Rights",
					"Arts & Culture",
					"Community",
					"Computers & Technology",
					"Education",
					"Healthcare & Medicine",
					"Elderly",
				],
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
			location: {
				required: {
					string: {
						place: { maxLength: 100 },
						street: { maxLength: 100 },
						city: { maxLength: 100 },
						county: { maxLength: 100 },
					},
					boolean: {
						isOnline: {},
					},
				},
				client_specialEdit: true,
			},
		},
		boolean: {
			isFlexible: {},
		},
		number: {
			minHoursPerWeek: {},
			maxHoursPerWeek: { greaterOrEqualTo: "minHoursPerWeek" },
			requestedNumVolunteers: {},
		},
	},
};

export const loginSpec: FieldConstraintsCollection = {
	required: {
		string: {
			email: { maxLength: 320 },
			password: {},
		},
	},
};

export const searchListingsSpec: FieldConstraintsCollection = {
	required: {
		string: {
			keywords: {},
		},
	},
	optional: {
		string: {
			targetLoc: {},
			category: {
				enum: ["Any", ...(listings.required?.string?.category?.enum ?? [])],
			},
			minHours: {},
			maxHours: {},
			isOnline: { enum: ["true", "false"] },
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
