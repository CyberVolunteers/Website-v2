import axios from "axios";
import { cacheQuery, RedisCacheStores } from "./email/redis";
import { logger } from "./logger";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";

const geocodingKey = process.env.GEOCODING_KEY;

// export async function getSpecificIdentifiers(
// 	genericIdentifier: string,
// 	store: RedisCacheStores
// ): Promise<{
// 	generic: string;
// 	specific: string[];
// } | null> {
// 	return JSON.parse(
// 		await cacheQuery(
// 			genericIdentifier,
// 			store,
// 			// case insensitive
// 			true,
// 			async () => {
// 				logger.warn("server.location.getSpecificIdentifiers: fetching data");
// 				const client = new Client({});

// 				let identifierToQuery = genericIdentifier;
// 				if (!identifierToQuery.toLowerCase().includes("uk"))
// 					identifierToQuery += ", UK";

// 				// console.log(
// 				// 	JSON.stringify(
// 				// 		(
// 				// 			await client.geocode({
// 				// 				params: {
// 				// 					key: geocodingKey ?? "",
// 				// 					address: "1 Gristhorpe Road",
// 				// 				},
// 				// 			})
// 				// 		).data
// 				// 	)
// 				// );

// 				const results = await client.findPlaceFromText({
// 					params: {
// 						fields: ["formatted_address"],
// 						key: geocodingKey ?? "",
// 						input: identifierToQuery,
// 						inputtype: PlaceInputType.textQuery,
// 					},
// 				});

// 				if (results.data.status !== "OK" || results.status >= 400)
// 					throw new Error(
// 						`server.location.getSpecificIdentifiers: request failed with message ${results.statusText}`
// 					);

// 				const data = results.data.candidates;

// 				// if no results, we are not sure what to do
// 				if (!Array.isArray(data) || data.length === 0) return "null"; // JSON representation of null
// 				const specific = data.map(
// 					(el) =>
// 						el.formatted_address ??
// 						(() => {
// 							throw new Error(
// 								`server.location.getSpecificIdentifiers: address not returned by api`
// 							);
// 						})()
// 				);

// 				const returnString = JSON.stringify({
// 					generic: genericIdentifier,
// 					specific,
// 				});
// 				return returnString;
// 			}
// 		)
// 	);
// }

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

// export async function getAddressSuggestions(q: string) {
// 	const client = new Client({});
// 	const placeAutocompleteResults = await client.placeAutocomplete({
// 		params: {
// 			input: q,
// 			// TODO: location + radius
// 			key: geocodingKey ?? "",
// 		},
// 	});
// 	console.log(JSON.stringify(placeAutocompleteResults.data.predictions));
// }
