import { Schema } from "mongoose";
import { numberValidate, stringValidate } from "./mongoValidateUtils"
import { users as usersPublic, organisations as orgPublic, listings as listingPublic } from "../config/shared/publicFieldConstants"
import { users as usersPrivate, organisations as orgPrivate, listings as listingPrivate } from "../config/server/privateFieldConstants"

const fieldTypesByTypeName = {
    string: String,
    number: Number,
    boolean: Boolean,
    date: Date,
    object: Object,
}

export const UserSchema = constructSchemaSettings(usersPublic, usersPrivate);
export const OrgSchema = constructSchemaSettings(orgPublic, orgPrivate);
export const ListingSchema = constructSchemaSettings(listingPublic, listingPublic);

function deepAssign(target, src) {
    if (src === undefined) return target; // return target if there is nothing in src to override target with
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

function constructSchemaSettings(fieldsPublic, fieldsPrivate = {}) {

    // since Object.assign gives us a shallow copy, we can't use it
    const fields = deepAssign(fieldsPublic, fieldsPrivate);
    const schemaSettings = {};
    let multiParams = [];

    Object.entries(fields).filter(([key, value]) => ["required", "optional"].includes(key)).forEach(([typeContainerKey, typeContainer]) => {
        const isRequired = typeContainerKey === "required";

        Object.entries(fieldTypesByTypeName).forEach(([groupName, type]) => {
            // if an object, recurse
            if (!typeContainer[groupName]) return;
            Object.entries(typeContainer[groupName]).forEach(([entryName, additionalData]) => {
                if (groupName === "object") return schemaSettings[entryName] = {
                    type: constructSchemaSettings(additionalData),
                    required: isRequired,
                }
                const currentEntry = { type, required: isRequired };

                // if it is a sub-document, then add it
                // callback can be left undefined to set the value directly
                function applyCallback(settingName, callback, targetKey = settingName) {
                    if (additionalData[settingName] !== undefined) currentEntry[targetKey] = callback(additionalData[settingName]);
                }

                function applyValue(settingName, targetKey = settingName) {
                    if (additionalData[settingName] !== undefined) currentEntry[targetKey] = additionalData[settingName]; // "if" so that we don't leave "undefined" keys there
                }

                function rememberMultiParam(settingName, validator) {
                    const otherParams = additionalData[settingName];
                    if (otherParams === undefined) return;
                    const outVals = [validator, entryName];
                    if (otherParams instanceof Array) outVals.push(...otherParams);
                    else outVals.push(otherParams);
                    multiParams.push(outVals);
                }

                applyCallback("maxLength", stringValidate.maxLength, "validate");
                applyCallback("exactLength", stringValidate.exactLength, "validate");
                rememberMultiParam("greaterOrEqualTo", numberValidate.greaterOrEqualTo);
                applyValue("default");
                applyValue("enum");

                schemaSettings[entryName] = currentEntry;
            })
        })
    })

    const out = new Schema(schemaSettings)
    multiParams.forEach((settings) => {
        console.log("settings", settings);
        const validator = settings.shift();

        // make sure all the parameters are required (otherwise the functions do not make much sense)
        out.pre("validate", validator(settings));
    })
    return out;
}
