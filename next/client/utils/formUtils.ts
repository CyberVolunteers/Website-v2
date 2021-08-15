import { Flattened } from "combined-validator";

export function addError(overallErrors: {
    [key: string]: string;
},
    setOverallErrors: React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>,
    name: string, e: string) {
    const overallErrorsCopy = Object.assign({}, overallErrors);
    overallErrorsCopy[name] = e;
    setOverallErrors(overallErrorsCopy);
}

export function setFieldOrder(fields: Flattened, order: string[], isAtTheEnd: boolean = false){
    const copy = Object.assign({}, fields);
    const collected = {} as {
        [key: string]: any
    };

    order.forEach(k => {
        if(copy[k] === undefined) return;
        collected[k] = copy[k];
        delete copy[k];
    })

    if(isAtTheEnd) return {...copy, ...collected};
    else return {...collected, ...copy};
}
