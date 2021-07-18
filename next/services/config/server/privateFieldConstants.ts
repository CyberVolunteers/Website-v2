import { FieldConstraintsCollection } from "../shared/FieldTypes"

// NOTE: this file works together with ../shared/publicFieldConstants.ts!

export const users: FieldConstraintsCollection = {
    required: {
        string: {
            passwordHash: { exactLength: 60 },
        },
    },
    optional: {
        boolean: {
            isEmailVerified: { default: false },
            isAdmin: { default: false }
        }
    },
};
