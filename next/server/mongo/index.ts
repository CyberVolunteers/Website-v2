import { dbServer, dbName } from "./config";
import { connect, Mongoose } from "mongoose";
import { logger } from "../logger";

global.mongoConnectionDetails = (global.mongoConnectionDetails ?? {
	instance: null,
	promise: null,
}) as MongoConnectionDetails;

/**
 * create and return a *new* connection
 * @returns a new mongo instance
 */
async function getNewMongo() {
	logger.info("server.mongo:Getting new instance");
	return await connect(`mongodb://${dbServer}/${dbName}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		user: process.env.MONGO_USERNAME,
		pass: process.env.MONGO_PASSWORD,
	});
}

/**
 * Get a (possibly cached) mongo instance
 * @returns a mongo instance
 */
export const getMongo = async function () {
	if (!!global.mongoConnectionDetails.instance)
		return global.mongoConnectionDetails.instance;
	if (!!global.mongoConnectionDetails.promise)
		return await global.mongoConnectionDetails.promise;

	global.mongoConnectionDetails.promise = getNewMongo();

	global.mongoConnectionDetails.promise
		.then((newInstance) => {
			global.mongoConnectionDetails.instance = newInstance;
		})
		.catch((err) => {
			logger.error("server.mongo.index:", err);
			global.mongoConnectionDetails.instance =
				global.mongoConnectionDetails.promise = null;
		});

	return await global.mongoConnectionDetails.promise;
};
