import { Schema } from "mongoose";
import { stringValidate } from "./mongoValidateUtils"
import { users as usersPublic } from "../config/shared/publicFieldConstants"
import { users as usersPrivate } from "../config/server/privateFieldConstants"

const fieldTypesByTypeName = {
    string: String,
    number: Number,
    boolean: Boolean,
    date: Date
}

export default {
    UserSchema: new Schema(constructSchemaSettings(usersPublic, usersPrivate))
}

function constructSchemaSettings(fieldsPublic, fieldsPrivate = {}) {

    // since Object.assign gives us a shallow copy, we can't use it
    function deepAssign(target, src) {
        if (src === undefined) return target; // return targer if there is nothing in src
        const isRecursible = (val) => val instanceof Object || val instanceof Array;
        if (!isRecursible(src) || !isRecursible(target)) return src; // if we can not recurse anymore, then choose src

        const keys = new Set(Object.keys(target))
        Object.keys(src).forEach((k) => keys.add(k)); // a set allows us not to bother about duplicates

        const out = target instanceof Array ? [] : {}; // the original Object.assign seems to select the type based on the target
        keys.forEach((k) => {
            out[k] = deepAssign(target[k], src[k])
        })
        return out;
    }

    const fields = deepAssign(fieldsPublic, fieldsPrivate);
    const out = {};

    Object.entries(fields).filter(([key, value]) => ["required", "optional"].includes(key)).forEach(([typeContainerKey, typeContainer]) => {
        const isRequired = typeContainerKey === "required";

        Object.entries(fieldTypesByTypeName).forEach(([groupName, type]) => {
            if (!typeContainer[groupName]) return;
            Object.entries(typeContainer[groupName]).forEach(([entryName, additionalData]) => {
                const currentEntry = { type, required: isRequired };

                // callback can be left undefined to set the value directly
                function applyCallback(settingName, callback, targetKey = settingName) {
                    if (additionalData[settingName] !== undefined) currentEntry[targetKey] = callback(additionalData[settingName]);
                }

                function applyValue(settingName, targetKey = settingName) {
                    if (additionalData[settingName] !== undefined) currentEntry[targetKey] = additionalData[settingName]; // "if" so that we don't leave "undefined" keys there
                }

                applyCallback("maxLength", stringValidate.maxLength, "validate");
                applyCallback("exactLength", stringValidate.exactLength, "validate");
                applyValue("default");

                out[entryName] = currentEntry;
            })
        })
    })

    return out;
}
