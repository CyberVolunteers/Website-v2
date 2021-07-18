import Schemas from "./mongoSchemas"
import { model, Schema } from "mongoose"

export default {
    User: getModel("users", Schemas.UserSchema)
}

function getModel(name: string, schema: Schema) {
    try {
        return model(name);
    } catch {
        return model(name, schema)
    }
}