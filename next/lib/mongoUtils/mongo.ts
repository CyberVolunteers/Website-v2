import { dbServer, dbName } from "../config"
import { connect, Mongoose } from "mongoose"
import Models from "./mongoModels"

interface MongoConnectionDetails {
    instance: Mongoose | null,
    promise: Promise<Mongoose> | null
}
const mongoConnectionDetails: MongoConnectionDetails = {
    instance: null,
    promise: null
}

async function getNewMongo() {
    return await connect(`mongodb://${dbServer}/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        user: process.env.MONGO_USERNAME,
        pass: process.env.MONGO_PASSWORD,
    });
}

export const getMongo = async function () {
    if (!!mongoConnectionDetails.instance) return mongoConnectionDetails.instance;
    if (!!mongoConnectionDetails.promise) return await mongoConnectionDetails.promise;

    mongoConnectionDetails.promise = getNewMongo();

    mongoConnectionDetails.promise.then((newInstance) => {
        mongoConnectionDetails.instance = newInstance;
    }).catch((err) => {
        console.error(err);
        mongoConnectionDetails.instance = mongoConnectionDetails.promise = null;
    })

    return await mongoConnectionDetails.promise;
}
