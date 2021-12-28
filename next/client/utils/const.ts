// https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/488478/Bulk_Data_Transfer_-_additional_validation_valid_from_12_November_2015.pdf

export const incorrectUUIDError = "The uuid token was incorrect.";

export const postcodeRE =
	/^([Gg][Ii][Rr]0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})$/;

export const pagesWithReducedHeaderAndFooter = [
	"/welcome",
	"/changePassword",
	"/confirmEmail",
	"/login",
	"/userSignup",
];

export const maxSearchDistanceMeters = 30 * 1000;
export const distanceRelativeScore = 0.75;

export const countryCodes = [
	{ code: "AF", name: "Afghanistan" },
	{ code: "AL", name: "Albania" },
	{ code: "DZ", name: "Algeria" },
	{ code: "AS", name: "American Samoa" },
	{ code: "AD", name: "Andorra" },
	{ code: "AO", name: "Angola" },
	{ code: "AI", name: "Anguilla" },
	{ code: "AQ", name: "Antarctica" },
	{ code: "AG", name: "Antigua and Barbuda" },
	{ code: "AR", name: "Argentina" },
	{ code: "AM", name: "Armenia" },
	{ code: "AW", name: "Aruba" },
	{ code: "AU", name: "Australia" },
	{ code: "AT", name: "Austria" },
	{ code: "AZ", name: "Azerbaijan" },
	{ code: "BS", name: "Bahamas (the)" },
	{ code: "BH", name: "Bahrain" },
	{ code: "BD", name: "Bangladesh" },
	{ code: "BB", name: "Barbados" },
	{ code: "BY", name: "Belarus" },
	{ code: "BE", name: "Belgium" },
	{ code: "BZ", name: "Belize" },
	{ code: "BJ", name: "Benin" },
	{ code: "BM", name: "Bermuda" },
	{ code: "BT", name: "Bhutan" },
	{
		code: "BO",

		name: "Bolivia (Plurinational State of)",
	},
	{
		code: "BQ",

		name: "Bonaire, Sint Eustatius and Saba",
	},
	{ code: "BA", name: "Bosnia and Herzegovina" },
	{ code: "BW", name: "Botswana" },
	{ code: "BV", name: "Bouvet Island" },
	{ code: "BR", name: "Brazil" },
	{
		code: "IO",

		name: "British Indian Ocean Territory (the)",
	},
	{ code: "BN", name: "Brunei Darussalam" },
	{ code: "BG", name: "Bulgaria" },
	{ code: "BF", name: "Burkina Faso" },
	{ code: "BI", name: "Burundi" },
	{ code: "CV", name: "Cabo Verde" },
	{ code: "KH", name: "Cambodia" },
	{ code: "CM", name: "Cameroon" },
	{ code: "CA", name: "Canada" },
	{ code: "KY", name: "Cayman Islands (the)" },
	{
		code: "CF",

		name: "Central African Republic (the)",
	},
	{ code: "TD", name: "Chad" },
	{ code: "CL", name: "Chile" },
	{ code: "CN", name: "China" },
	{ code: "CX", name: "Christmas Island" },
	{
		code: "CC",

		name: "Cocos (Keeling) Islands (the)",
	},
	{ code: "CO", name: "Colombia" },
	{ code: "KM", name: "Comoros (the)" },
	{
		code: "CD",

		name: "Congo (the Democratic Republic of the)",
	},
	{ code: "CG", name: "Congo (the)" },
	{ code: "CK", name: "Cook Islands (the)" },
	{ code: "CR", name: "Costa Rica" },
	{ code: "HR", name: "Croatia" },
	{ code: "CU", name: "Cuba" },
	{ code: "CW", name: "Curaçao" },
	{ code: "CY", name: "Cyprus" },
	{ code: "CZ", name: "Czechia" },
	{ code: "CI", name: "Côte d'Ivoire" },
	{ code: "DK", name: "Denmark" },
	{ code: "DJ", name: "Djibouti" },
	{ code: "DM", name: "Dominica" },
	{ code: "DO", name: "Dominican Republic (the)" },
	{ code: "EC", name: "Ecuador" },
	{ code: "EG", name: "Egypt" },
	{ code: "SV", name: "El Salvador" },
	{ code: "GQ", name: "Equatorial Guinea" },
	{ code: "ER", name: "Eritrea" },
	{ code: "EE", name: "Estonia" },
	{ code: "SZ", name: "Eswatini" },
	{ code: "ET", name: "Ethiopia" },
	{
		code: "FK",

		name: "Falkland Islands (the) [Malvinas]",
	},
	{ code: "FO", name: "Faroe Islands (the)" },
	{ code: "FJ", name: "Fiji" },
	{ code: "FI", name: "Finland" },
	{ code: "FR", name: "France" },
	{ code: "GF", name: "French Guiana" },
	{ code: "PF", name: "French Polynesia" },
	{
		code: "TF",

		name: "French Southern Territories (the)",
	},
	{ code: "GA", name: "Gabon" },
	{ code: "GM", name: "Gambia (the)" },
	{ code: "GE", name: "Georgia" },
	{ code: "DE", name: "Germany" },
	{ code: "GH", name: "Ghana" },
	{ code: "GI", name: "Gibraltar" },
	{ code: "GR", name: "Greece" },
	{ code: "GL", name: "Greenland" },
	{ code: "GD", name: "Grenada" },
	{ code: "GP", name: "Guadeloupe" },
	{ code: "GU", name: "Guam" },
	{ code: "GT", name: "Guatemala" },
	{ code: "GG", name: "Guernsey" },
	{ code: "GN", name: "Guinea" },
	{ code: "GW", name: "Guinea-Bissau" },
	{ code: "GY", name: "Guyana" },
	{ code: "HT", name: "Haiti" },
	{
		code: "HM",

		name: "Heard Island and McDonald Islands",
	},
	{ code: "VA", name: "Holy See (the)" },
	{ code: "HN", name: "Honduras" },
	{ code: "HK", name: "Hong Kong" },
	{ code: "HU", name: "Hungary" },
	{ code: "IS", name: "Iceland" },
	{ code: "IN", name: "India" },
	{ code: "ID", name: "Indonesia" },
	{
		code: "IR",
		name: "Iran (Islamic Republic of)",
	},
	{ code: "IQ", name: "Iraq" },
	{ code: "IE", name: "Ireland" },
	{ code: "IM", name: "Isle of Man" },
	{ code: "IL", name: "Israel" },
	{ code: "IT", name: "Italy" },
	{ code: "JM", name: "Jamaica" },
	{ code: "JP", name: "Japan" },
	{ code: "JE", name: "Jersey" },
	{ code: "JO", name: "Jordan" },
	{ code: "KZ", name: "Kazakhstan" },
	{ code: "KE", name: "Kenya" },
	{ code: "KI", name: "Kiribati" },
	{
		code: "KP",
		name: "Korea (the Democratic People's Republic of)",
	},
	{ code: "KR", name: "Korea (the Republic of)" },
	{ code: "KW", name: "Kuwait" },
	{ code: "KG", name: "Kyrgyzstan" },
	{
		code: "LA",
		name: "Lao People's Democratic Republic (the)",
	},
	{ code: "LV", name: "Latvia" },
	{ code: "LB", name: "Lebanon" },
	{ code: "LS", name: "Lesotho" },
	{ code: "LR", name: "Liberia" },
	{ code: "LY", name: "Libya" },
	{ code: "LI", name: "Liechtenstein" },
	{ code: "LT", name: "Lithuania" },
	{ code: "LU", name: "Luxembourg" },
	{ code: "MO", name: "Macao" },
	{ code: "MG", name: "Madagascar" },
	{ code: "MW", name: "Malawi" },
	{ code: "MY", name: "Malaysia" },
	{ code: "MV", name: "Maldives" },
	{ code: "ML", name: "Mali" },
	{ code: "MT", name: "Malta" },
	{ code: "MH", name: "Marshall Islands (the)" },
	{ code: "MQ", name: "Martinique" },
	{ code: "MR", name: "Mauritania" },
	{ code: "MU", name: "Mauritius" },
	{ code: "YT", name: "Mayotte" },
	{ code: "MX", name: "Mexico" },
	{
		code: "FM",

		name: "Micronesia (Federated States of)",
	},
	{
		code: "MD",
		name: "Moldova (the Republic of)",
	},
	{ code: "MC", name: "Monaco" },
	{ code: "MN", name: "Mongolia" },
	{ code: "ME", name: "Montenegro" },
	{ code: "MS", name: "Montserrat" },
	{ code: "MA", name: "Morocco" },
	{ code: "MZ", name: "Mozambique" },
	{ code: "MM", name: "Myanmar" },
	{ code: "NA", name: "Namibia" },
	{ code: "NR", name: "Nauru" },
	{ code: "NP", name: "Nepal" },
	{ code: "NL", name: "Netherlands (the)" },
	{ code: "NC", name: "New Caledonia" },
	{ code: "NZ", name: "New Zealand" },
	{ code: "NI", name: "Nicaragua" },
	{ code: "NE", name: "Niger (the)" },
	{ code: "NG", name: "Nigeria" },
	{ code: "NU", name: "Niue" },
	{ code: "NF", name: "Norfolk Island" },
	{
		code: "MP",
		name: "Northern Mariana Islands (the)",
	},
	{ code: "NO", name: "Norway" },
	{ code: "OM", name: "Oman" },
	{ code: "PK", name: "Pakistan" },
	{ code: "PW", name: "Palau" },
	{ code: "PS", name: "Palestine, State of" },
	{ code: "PA", name: "Panama" },
	{ code: "PG", name: "Papua New Guinea" },
	{ code: "PY", name: "Paraguay" },
	{ code: "PE", name: "Peru" },
	{ code: "PH", name: "Philippines (the)" },
	{ code: "PN", name: "Pitcairn" },
	{ code: "PL", name: "Poland" },
	{ code: "PT", name: "Portugal" },
	{ code: "PR", name: "Puerto Rico" },
	{ code: "QA", name: "Qatar" },
	{
		code: "MK",

		name: "Republic of North Macedonia",
	},
	{ code: "RO", name: "Romania" },
	{ code: "RU", name: "Russian Federation (the)" },
	{ code: "RW", name: "Rwanda" },
	{ code: "RE", name: "Réunion" },
	{ code: "BL", name: "Saint Barthélemy" },
	{
		code: "SH",
		name: "Saint Helena, Ascension and Tristan da Cunha",
	},
	{ code: "KN", name: "Saint Kitts and Nevis" },
	{ code: "LC", name: "Saint Lucia" },
	{
		code: "MF",
		name: "Saint Martin (French part)",
	},
	{
		code: "PM",
		name: "Saint Pierre and Miquelon",
	},
	{
		code: "VC",
		name: "Saint Vincent and the Grenadines",
	},
	{ code: "WS", name: "Samoa" },
	{ code: "SM", name: "San Marino" },
	{ code: "ST", name: "Sao Tome and Principe" },
	{ code: "SA", name: "Saudi Arabia" },
	{ code: "SN", name: "Senegal" },
	{ code: "RS", name: "Serbia" },
	{ code: "SC", name: "Seychelles" },
	{ code: "SL", name: "Sierra Leone" },
	{ code: "SG", name: "Singapore" },
	{
		code: "SX",
		name: "Sint Maarten (Dutch part)",
	},
	{ code: "SK", name: "Slovakia" },
	{ code: "SI", name: "Slovenia" },
	{ code: "SB", name: "Solomon Islands" },
	{ code: "SO", name: "Somalia" },
	{ code: "ZA", name: "South Africa" },
	{
		code: "GS",
		name: "South Georgia and the South Sandwich Islands",
	},
	{ code: "SS", name: "South Sudan" },
	{ code: "ES", name: "Spain" },
	{ code: "LK", name: "Sri Lanka" },
	{ code: "SD", name: "Sudan (the)" },
	{ code: "SR", name: "Suriname" },
	{ code: "SJ", name: "Svalbard and Jan Mayen" },
	{ code: "SE", name: "Sweden" },
	{ code: "CH", name: "Switzerland" },
	{ code: "SY", name: "Syrian Arab Republic" },
	{ code: "TW", name: "Taiwan" },
	{ code: "TJ", name: "Tajikistan" },
	{
		code: "TZ",
		name: "Tanzania, United Republic of",
	},
	{ code: "TH", name: "Thailand" },
	{ code: "TL", name: "Timor-Leste" },
	{ code: "TG", name: "Togo" },
	{ code: "TK", name: "Tokelau" },
	{ code: "TO", name: "Tonga" },
	{ code: "TT", name: "Trinidad and Tobago" },
	{ code: "TN", name: "Tunisia" },
	{ code: "TR", name: "Turkey" },
	{ code: "TM", name: "Turkmenistan" },
	{
		code: "TC",

		name: "Turks and Caicos Islands (the)",
	},
	{ code: "TV", name: "Tuvalu" },
	{ code: "UG", name: "Uganda" },
	{ code: "UA", name: "Ukraine" },
	{
		code: "AE",

		name: "United Arab Emirates (the)",
	},
	{
		code: "GB",

		name: "United Kingdom of Great Britain and Northern Ireland (the)",
	},
	{
		code: "UM",

		name: "United States Minor Outlying Islands (the)",
	},
	{
		code: "US",

		name: "United States of America (the)",
	},
	{ code: "UY", name: "Uruguay" },
	{ code: "UZ", name: "Uzbekistan" },
	{ code: "VU", name: "Vanuatu" },
	{
		code: "VE",

		name: "Venezuela (Bolivarian Republic of)",
	},
	{ code: "VN", name: "Viet Nam" },
	{ code: "VG", name: "Virgin Islands (British)" },
	{ code: "VI", name: "Virgin Islands (U.S.)" },
	{ code: "WF", name: "Wallis and Futuna" },
	{ code: "EH", name: "Western Sahara" },
	{ code: "YE", name: "Yemen" },
	{ code: "ZM", name: "Zambia" },
	{ code: "ZW", name: "Zimbabwe" },
	{ code: "AX", name: "Åland Islands" },
];

export const months = {
	January: "Jan",
	February: "Feb",
	March: "Mar",
	April: "Apr",
	May: "May",
	June: "Jun",
	July: "Jul",
	August: "Aug",
	September: "Sep",
	October: "Oct",
	November: "Nov",
	December: "Dec",
};

export const categoryNames = [
	"Community", // 0
	"Technology", // 1
	"Education", // 2
	"Healthcare", // 3
	"Elderly", // 4
	"Race & Ethnicity", // 5
	"International", // 6
	"Arts & Culture", // 7
];

export const expandedCategoryNames = categoryNames.concat(["scraped"]);

export type LocalHeaderItem =
	| undefined
	| "General"
	| "Personal Information"
	| "Volunteering Stats";
export const localHeaderItems: LocalHeaderItem[] = [
	undefined,
	"General",
	"Personal Information",

	// "Volunteering Stats",
	//
];
export const indexCardListings = [
	{
		uuid: "7fab624e-2ee7-40a8-a02b-0568b9ef1223",
		categoryIndex: 0,
		charityName: "Black and Minority Ethnic Young People's Project",
	},
	{
		uuid: "db5bf42c-edee-4c90-b204-efe3d2a7f63b",
		categoryIndex: 0,
		charityName: "Guild Care",
	},
	{
		uuid: "b79c485e-192b-4dbe-a2a2-5a796b45e12c",
		categoryIndex: 0,
		charityName: "Freedom Power Chairs",
	},
	{
		uuid: "f5266dce-7cda-4c0f-bae3-59f26f91a86e",
		categoryIndex: 0,
		charityName: "Guild Care",
	},
	{
		uuid: "04bbe124-6d03-4f22-af3c-3ce73ab05031",
		categoryIndex: 0,
		charityName: "Hangleton and Knoll Project",
	},
	{
		uuid: "023cd037-820b-4a9f-ab42-206a25e2d26b",
		categoryIndex: 1,
		charityName: "OSCAR Foundation",
	},
	{
		uuid: "848f8fad-a7ba-447c-bf91-04f76de7168d",
		categoryIndex: 1,
		charityName: "Freedom Power Chairs",
	},
	{
		uuid: "3b3da57e-3f8b-48a1-8362-d82287541ab8",
		categoryIndex: 1,
		charityName: "Hangleton and Knoll Project",
	},
	{
		uuid: "8c8221d5-1db0-45cd-88b0-63eb88a739db",
		categoryIndex: 1,
		charityName: "Freedom Power Chairs",
	},
	{
		uuid: "f5266dce-7cda-4c0f-bae3-59f26f91a86e",
		categoryIndex: 1,
		charityName: "Guild Care",
	},
	{
		uuid: "736fad38-bb13-47bd-a450-75d56f96ad4d",
		categoryIndex: 2,
		charityName: "OSCAR Foundation",
	},
	{
		uuid: "7fab624e-2ee7-40a8-a02b-0568b9ef1223",
		categoryIndex: 2,
		charityName: "Black and Minority Ethnic Young People's Project",
	},
	{
		uuid: "8db27166-ad76-480c-9198-f195a95c78fe",
		categoryIndex: 2,
		charityName: "OSCAR Foundation",
	},
	{
		uuid: "80a67977-9ce3-4d3d-8ada-2d88b1c300be",
		categoryIndex: 2,
		charityName: "Freedom Power Chairs",
	},
	{
		uuid: "e28b22e8-a9b6-48fa-9c51-5eaef40b2588",
		categoryIndex: 2,
		charityName: "OSCAR Foundation",
	},
	{
		uuid: "b0c95753-a2b6-4ae2-8428-fc586a234187",
		categoryIndex: 3,
		charityName: "Freedom Power Chairs",
	},
	{
		uuid: "ee6ea25b-718c-42a3-b159-3b7f653f6644",
		categoryIndex: 3,
		charityName: "Guild Care",
	},
	{
		uuid: "5b410088-f520-4900-b2e0-dc2b3cbd02a4",
		categoryIndex: 3,
		charityName: "Freedom Power Chairs",
	},
	{
		uuid: "c18d08dc-4b52-41b9-b91e-861fe9e1b3ea",
		categoryIndex: 3,
		charityName: "Time to Talk Befriending",
	},
	{
		uuid: "b79c485e-192b-4dbe-a2a2-5a796b45e12c",
		categoryIndex: 3,
		charityName: "Freedom Power Chairs",
	},
	{
		uuid: "c18d08dc-4b52-41b9-b91e-861fe9e1b3ea",
		categoryIndex: 4,
		charityName: "Time to Talk Befriending",
	},
	{
		uuid: "db5bf42c-edee-4c90-b204-efe3d2a7f63b",
		categoryIndex: 4,
		charityName: "Guild Care",
	},
	{
		uuid: "5b410088-f520-4900-b2e0-dc2b3cbd02a4",
		categoryIndex: 4,
		charityName: "Freedom Power Chairs",
	},
	{
		uuid: "ee6ea25b-718c-42a3-b159-3b7f653f6644",
		categoryIndex: 4,
		charityName: "Guild Care",
	},
	{
		uuid: "b0c95753-a2b6-4ae2-8428-fc586a234187",
		categoryIndex: 4,
		charityName: "Freedom Power Chairs",
	},
];
