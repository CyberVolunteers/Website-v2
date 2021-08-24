import {
	deepAssign,
	FieldConstraintsCollection,
	flatten,
} from "combined-validator";

//TODO: separate into push and pull fields
export const users: FieldConstraintsCollection = {
	required: {
		string: {
			firstName: { maxLength: 30 },
			lastName: { maxLength: 30 },
			email: { maxLength: 320 },
			password: {},
			gender: { enum: ["male", "female", "other"] },
			city: { maxLength: 85 },
			country: { maxLength: 56 },
			skillsAndInterests: { maxLength: 1000 },
		},
		date: {
			birthDate: {},
		},
	},
	optional: {
		string: {
			nationality: { maxLength: 60 },
			//@ts-ignore
			phoneNumber: { isPhoneNumber: true },
		},
	},
};

export const organisations: FieldConstraintsCollection = {
	required: {
		string: {
			email: { maxLength: 320 },
			password: {},
			orgType: { maxLength: 60 },
			orgName: { maxLength: 150 },
			orgDesc: { maxLength: 5000 },
			orgLocation: { maxLength: 150 },
			//@ts-ignore
			phoneNumber: { isPhoneNumber: true },
		},
	},
	optional: {
		string: {
			websiteUrl: { maxLength: 100 },
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
			imagePath: {},
			uuid: { exactLength: 36 },
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

// deep copy
// I have no clue why deepAssign is not working in this case
export const userDataUpdateSpec: FieldConstraintsCollection = JSON.parse(
	JSON.stringify(users)
);
// NOTE: deleting some fields
delete userDataUpdateSpec.required?.string?.email;
delete userDataUpdateSpec.required?.string?.password;
// Make all optional
userDataUpdateSpec.optional = deepAssign(
	userDataUpdateSpec.optional,
	userDataUpdateSpec.required
);
delete userDataUpdateSpec.required;

// deep copy
// I have no clue why deepAssign is not working in this case
export const orgDataUpdateSpec: FieldConstraintsCollection = JSON.parse(
	JSON.stringify(organisations)
);
// NOTE: deleting some fields
delete orgDataUpdateSpec.required?.string?.email;
delete orgDataUpdateSpec.required?.string?.password;
// Make all optional
orgDataUpdateSpec.optional = deepAssign(
	orgDataUpdateSpec.optional,
	orgDataUpdateSpec.required
);
delete orgDataUpdateSpec.required;

// deep copy
// I have no clue why deepAssign is not working in this case
export const listingDataUpdateSpec: FieldConstraintsCollection = JSON.parse(
	JSON.stringify(listings)
);
// NOTE: deleting some fields
delete listingDataUpdateSpec.required?.string?.imagePath;
delete listingDataUpdateSpec.required?.string?.uuid;

// Make all optional
listingDataUpdateSpec.optional = deepAssign(
	listingDataUpdateSpec.optional,
	listingDataUpdateSpec.required
);
listingDataUpdateSpec.required = {
	string: {
		uuid: { exactLength: 36 },
	},
};
