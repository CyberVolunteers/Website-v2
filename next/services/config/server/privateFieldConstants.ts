import { FieldConstraintsCollection } from "../shared/FieldTypes"

// NOTE: this file works together with ../shared/publicFieldConstants.ts!

export const users: FieldConstraintsCollection = {
    required: {
        string: {
            passwordHash: { exactLength: 60 },
        },
    },
    optional: {
        number: {
            adminLevel: { default: 0 }
        },
        boolean: {
            isEmailVerified: { default: false },
        }
    },
};

export const organisations: FieldConstraintsCollection = {
    required: {
        string: {
            passwordHash: { exactLength: 60 }
        },
        boolean: {
            isEmailVerified: { default: false },
            isCharityVerified: { default: false }
        }
    }
}

export const listings: FieldConstraintsCollection = {
    required: {
        number: {
            currentNumVolunteers: {},
        },
    },
}
