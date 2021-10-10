interface MongoConnectionDetails {
	instance: Mongoose | null;
	promise: Promise<Mongoose> | null;
}

declare var mongoConnectionDetails: MongoConnectionDetails;
