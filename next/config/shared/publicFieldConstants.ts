import { FieldConstraintsCollection } from "combined-validator";

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
            nationality: { maxLength: 60, lazyFill: true },
            phoneNumber: { maxLength: 16, lazyFill: true },
        },

    },
};


export const organisations: FieldConstraintsCollection = {
    required: {
        string: {
            email: { maxLength: 320 },
            orgType: { maxLength: 60 },
            orgName: { maxLength: 150 },
            orgDesc: { maxLength: 5000 },
            phoneNumber: { maxLength: 16 },
            orgLocation: { maxLength: 150 }
        }
    },
    optional: {
        string: {
            websiteUrl: { maxLength: 100 },
        }
    }
}

export const listings: FieldConstraintsCollection = {
    required: {
        string: {
            duration: { maxLength: 1000 },
            place: { maxLength: 1000 },
            time: { maxLength: 1000 },
            skills: { maxLength: 3000 },
            requirements: { maxLength: 3000 },
            title: { maxLength: 150 },
            desc: { maxLength: 7000 },
            category: { enum: ["Advocacy & Human Rights", "Arts & Culture", "Community", "Computers & Technology", "Education", "Healthcare & Medicine", "Elderly"] },
        },
        object: {
            targetAudience: {
                optional: {
                    boolean: {
                        under16: { default: false },
                        between16And18: { default: false },
                        between18And55: { default: false },
                        over55: { default: false }
                    }
                }
            },
        },
        date: {
            createdDate: {},

        },
        boolean: {
            isFlexible: {}
        },
        number: {
            requestedNumVolunteers: {},
            minHoursPerWeek: {},
            maxHoursPerWeek: { greaterOrEqualTo: "minHoursPerWeek" },
        },
    },
}
