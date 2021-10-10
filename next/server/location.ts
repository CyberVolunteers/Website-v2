import axios from "axios";
import { logger } from "./logger";

const geocodingKey = process.env.GEOCODING_KEY;

/**
 * Gets latitude and longitude from a place name (NOTE: no cache involved)
 * @param placeDesc
 * @returns a promise with a tuple of the latitude and longitude (if found)
 */
export async function getLatAndLong(
	placeDesc: string
): Promise<[lat: number, long: number] | undefined> {
	logger.info("server.location: pinging with %s", placeDesc);
	// shamelessly stolen from the previous version
	const geocodingString = `https://app.geocodeapi.io/api/v1/search?apikey=${geocodingKey}&text=${encodeURIComponent(
		placeDesc
	)}`;
	const response = await axios.get(geocodingString);
	const out = response.data?.features?.[0]?.geometry?.coordinates;
	return Array.isArray(out) && out.length === 2
		? (out as [lat: number, long: number])
		: undefined;
}
