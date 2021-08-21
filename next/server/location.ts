import axios from "axios";
import { logger } from "./logger";

const geocodingKey = process.env.GEOCODING_KEY;

export async function getLatAndLong(placeDesc: string): Promise<[lat: number, long: number] | []> {
  logger.info("server.location: pinging with %s", placeDesc);
  // shamelessly stolen from the previous version
  const geocodingString = `https://app.geocodeapi.io/api/v1/search?apikey=${geocodingKey}&text=${encodeURIComponent(
    placeDesc
  )}`;
  const response = await axios.get(geocodingString);
  return response.data?.features?.[0]?.geometry?.coordinates ?? [];
}
