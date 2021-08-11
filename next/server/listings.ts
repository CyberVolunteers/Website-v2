import { getMongo } from "./mongo";
import { Listing, Org } from "./mongo/mongoModels";

export async function createListing(params: { [key: string]: any }, orgSession: { [key: string]: any }) {
	const mongoConn = await getMongo();
	const createdDate = new Date();
	const org = orgSession._id;
	const dataToSupply = Object.assign({}, params);

	Object.assign(dataToSupply, { createdDate, org })

	const mongoSession = await mongoConn.startSession();

	await mongoSession.withTransaction(async () => {
		const newListing = new Listing(dataToSupply);
		await newListing.save();

		// add the new id to the organisation
		await Org.updateOne(
			{ _id: orgSession._id },
			{ $push: { listings: newListing._id } }
		)
	});

	mongoSession.endSession()
}