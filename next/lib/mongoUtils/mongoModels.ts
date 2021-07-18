import Schemas from "./mongoSchemas"
import { model, Model, Schema } from "mongoose"

declare module NodeJS {
    interface Global {
        modelCache: Map<string, Model<any, any, any>>
    }
}

// make sure it persists
if (!global.modelCache) global.modelCache = new Map<string, Model<any, any, any>>()

export default {
    User: getModelCached("users", Schemas.UserSchema)
}


function getModelCached(name: string, schema: Schema): Model<any, any, any> {
    let m = modelCache.get(name)
    if (!m) {
        let newModel = model(name, schema)
        modelCache.set(name, newModel)
        return newModel;
    } else return m;
}