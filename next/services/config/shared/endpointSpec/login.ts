import { FieldConstraintsCollection } from "combined-validator";

const loginSpec: FieldConstraintsCollection = {
    required: {
        string: {
            email: {},
            password: {}
        },
    },
};

export default loginSpec;