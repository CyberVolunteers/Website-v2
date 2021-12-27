import { Listing, Org } from "./mongo/mongoModels";
import { baseListingImagePath } from "../serverAndClient/staticDetails";
import { v4 as uuidv4 } from "uuid";
import { connection } from "mongoose";
import { logger } from "./logger";
import sharp from "sharp";

// TODO: combine creating and updating a lsiting?
/**
 * creates a listing
 * @param params
 * @param orgSession organisation session id
 * @param imageFileExt file extension for the listing image
 * @param imageFileBuffer buffer for the listing image
 * @returns
 */
export async function createListing(
	params: { [key: string]: any },
	orgId: string,
	imageFileExt: string,
	imageFileBuffer: Buffer
) {
	const createdDate = new Date();
	const uuid = uuidv4();
	const imagePath = baseListingImagePath + uuid + imageFileExt;

	const address = params.location;

	const geocodingString = [
		address.place,
		address.street,
		address.city,
		address.county,
		"UK",
	].join(", ");

	const location = await getLatAndLong(geocodingString);

	if (location?.[0] === undefined) return "location";

	const dataToSupply = Object.assign({}, params);

	Object.assign(dataToSupply, {
		createdDate,
		organisation: orgId,
		imagePath,
		uuid,
		users: [],
		coords: {
			type: "Point",
			coordinates: location,
		},
	}); //TODO: check if this leaks when listings are queried

	try {
		await connection.transaction(async () => {
			const newListing = new Listing(dataToSupply);
			await sharp(imageFileBuffer)
				.resize({ width: 1024 })
				.toFile(process.env.baseDir + "/public" + imagePath);
			await newListing.save();
			// add the new id to the organisation
			await Org.updateOne(
				{ _id: orgId },
				{ $push: { listings: newListing._id } }
			);
		});
	} catch (e) {
		logger.error("server.listings:Error creating a listing: '%s'", e);
		return "generic";
	}
	return true;
}
