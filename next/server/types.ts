import { JTDParser } from "ajv/dist/types";
import { FieldConstraintsCollection } from "combined-validator";
import { NextApiRequest, NextApiResponse } from "next";

export type SupportedMethods = "GET" | "POST";

export type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
export type HandlerCollection = {
    [key in SupportedMethods]?: Handler;
};

export type AjvParserCollection = {
    [key in SupportedMethods]?: JTDParser<any>;
};

export type QueryFieldsCollection = {
    [key in SupportedMethods]?: FieldConstraintsCollection
}

export type ExtendedNextApiRequest = NextApiRequest & {
    originalUrl?: string,
    session?: any
}

export type ExtendedNextApiResponse = NextApiResponse & {

}