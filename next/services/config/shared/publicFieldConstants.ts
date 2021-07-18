import { FieldConstraintsCollection } from "./FieldTypes"

export const users: FieldConstraintsCollection = {
    required: {
        string: {
            firstName: { maxLength: 30 },
            lastName: { maxLength: 30 },
            email: { maxLength: 320 },
            gender: { enum: ["M", "F", "O"] },
            salutation: { maxLength: 5 },
            nationality: { maxLength: 60 },
            address: { maxLength: 150 },
            postcode: { maxLength: 12 },
            city: { maxLength: 85 },
            country: { maxLength: 56 },
            phoneNumber: { maxLength: 16 },
            languages: { maxLength: 200 },
            skillsAndInterests: { maxLength: 400 },
        },
    },
    optional: {
        string: {
            occupation: {},
            state: { maxLength: 50 },
            linkedIn: { maxLength: 75 },
        },
        date: {
            birthDate: {},

        },
    },
};
