import axios from "axios";
import { cacheQuery, RedisCacheStores } from "./email/redis";
import { logger } from "./logger";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";

const geocodingKey = process.env.GEOCODING_KEY;

export async function getPostcode(
	place_id: string
): Promise<string | undefined> {
	const client = new Client({});

	const placeData = await client.placeDetails({
		params: {
			key: geocodingKey ?? "",
			place_id,
		},
	});

	const addressData = placeData.data.result.address_components;
	const postcodeInfo = addressData?.find((el) =>
		(el.types as string[]).includes("postal_code")
	);

	return postcodeInfo?.long_name;
}

export async function rawGetPlaceAutocomplete(query: string) {
	const client = new Client({});

	// TODO: look into doing "SKU: Autocomplete (included with Places Details)"

	const placeAutocompleteResults = await client.placeAutocomplete({
		params: {
			input: query,
			// TODO: location in the UK + radius
			key: geocodingKey ?? "",
		},
	});
	return placeAutocompleteResults;
}
