export const stringValidate = {

    exactlLength: createValidation("This string field size does not match the required size", (value: string, length: number) => {
        return value.length == length;
    }),
    maxLength: createValidation("This string field is too long", (value: string, length: number) => {
        return value.length <= length;
    })
}

function wrapAndAddMessage(message: string, validator: (...args: any[]) => boolean) {
    return {
        validator,
        message
    }
}

function wrap(validator: (...args: any[]) => boolean) {
    return {
        validator,
    }
}

// "current" means that those values are no longer general
function createValidation<T>(message: string, validate: (toCheck: T, ...referenceVals: any[]) => boolean) {
    return function (addMessage: boolean, ...currentReferenceVals: any[]) {
        const currentValidate = (value: T) => validate.apply(null, [value, ...currentReferenceVals])

        return addMessage ? wrapAndAddMessage(message, currentValidate) : wrap(currentValidate);
    }
}