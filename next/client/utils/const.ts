// https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/488478/Bulk_Data_Transfer_-_additional_validation_valid_from_12_November_2015.pdf
export const postcodeRE =
	/^([Gg][Ii][Rr]0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})$/;

export const pagesWithReducedHeaderAndFooter = ["/welcome"];

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
];

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

export type CarouselListingData = {
	uuid: string;
	categoryIndex: number;
	opportunityTitle: string;
	charityName: string;
	imgName: string;
	desc: string;
};

export const indexPageListings: CarouselListingData[] = [
	{
		uuid: "7af5a892-8bfc-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 0,
		opportunityTitle: "BMEYPP Champions",
		charityName: "Black and Minority Ethnic Young People's Project",
		imgName: "BMEYPP_youth_champs.jpeg",
		desc: "The BMEYPP is a youth led project for Black, Arab, Asian and Dual Heritage young people aged 11-25. The BME Youth Champions is a way in which we ensure that young people have a say in the activities that happen at the BMEEYPP and play a role in making them happen.",
	},
	{
		uuid: "25d459b7-8c18-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 0,
		opportunityTitle: "Gardening volunteer",
		charityName: "Guild Care",
		imgName: "gardening.jpg",
		desc: "Assisting Guild Care’s gardener in the grounds of our Care Homes. Will involve light gardening duties, weeding, sweeping, cutting back and as importantly sharing your ideas.",
	},
	{
		uuid: "710627d9-9586-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 0,
		opportunityTitle: "Workshop Manager",
		charityName: "Freedom Power Chairs",
		imgName: "workshop.jpg",
		desc: "Oversight of all activities in the workshop. Delegated in part to supervisors. We have so far been unable to obtain funding to make this a paid role.",
	},
	{
		uuid: "b5a544db-8bff-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 0,
		opportunityTitle: "Retail Charity Shop Assistant",
		charityName: "Guild Care",
		imgName: "guildCare2.jpg",
		desc: "Our charity shop assistants help us to create a warm and friendly shopping environment to help in one of our Guild Care shops. We currently have 11 shops: Rustington, Broadwater, Rowlands Road, Goring Road, The Greenhouse (East Worthing), Strand Parade, Findon Valley, Warwick Street, Littlehampton, South Farm Road.",
	},
	{
		uuid: "ed6ea111-8c20-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 0,
		opportunityTitle: "Youth Club volunteers",
		charityName: "Hangleton and Knoll Project",
		imgName: "socialMediaVolunteer.jpg",
		desc: "Step Out is a group of young people who volunteer to make their community a better place. We are looking for young people aged 16-19 (25 with SEND) to support younger volunteers (age 12-14) to take part in a community action project. We will work as a group to deliver community information leaflets around the Hangleton and Knoll area. ",
	},
	{
		uuid: "21b505cb-9553-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 1,
		opportunityTitle: "Social Media Manager",
		charityName: "OSCAR Foundation",
		imgName: "oscar_social_media_manger.jpeg",
		desc: "The OSCAR Foundation is a youth led organisation based in Mumbai which uses football as a tool to engage underprivileged girls and boys living in the slum communities in education. OSCAR has one simple rule, No School, No Football and as a result over 3,500 girls and boys are regularly attending school and taking part in OSCAR’s life skills and football programme.",
	},
	{
		uuid: "85730846-8ca5-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 1,
		opportunityTitle: "Network Manager",
		charityName: "Freedom Power Chairs",
		imgName: "network.jpg",
		desc: "Oversee the management and growth of our intranet and web. We provide induction training.",
	},
	{
		uuid: "1602cd06-9195-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 1,
		opportunityTitle: "Youth Club Social Media Volunteer",
		charityName: "Hangleton and Knoll Project",
		imgName: "socialMediaVolunteer.jpg",
		desc: "The Hangleton and Knoll project youth team need a social media volunteer to...",
		//  advertise our sessions and post relevant content to our social media platforms. You will be liaising with the youth team staff to see what youth club sessions are happening and advertising them.",
	},
	{
		uuid: "c37df565-9583-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 1,
		opportunityTitle: "CAD Designer",
		charityName: "Freedom Power Chairs",
		imgName: "cad.jpg",
		desc: "Our charity needs a person who can design parts from scratch – mainly for our new electric trikes.",
	},
	{
		uuid: "b5a544db-8bff-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 1,
		opportunityTitle: "Retail Charity Shop Assistant",
		charityName: "Guild Care",
		imgName: "guildCareShop.jpg",
		desc: "Our charity shop assistants help us to create a warm and friendly shopping environment to help in one of our Guild Care shops. We currently have 11 shops: Rustington, Broadwater, Rowlands Road, Goring Road, The Greenhouse (East Worthing), Strand Parade, Findon Valley, Warwick Street, Littlehampton, South Farm Road.",
	},
	{
		uuid: "470037bb-9553-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 2,
		opportunityTitle: "Mentoring Young People",
		charityName: "OSCAR Foundation",
		imgName: "oscar_mentioring_young_people.jpeg",
		desc: "The OSCAR Foundation is a youth led organisation based in Mumbai which uses football as a tool to engage underprivileged girls and boys living in the slum communities in education. OSCAR has one simple rule, No School, No Football and as a result over 3,500 girls and boys are regularly attending school and taking part in OSCAR’s life skills and football programme.",
	},
	{
		uuid: "7af5a892-8bfc-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 2,
		opportunityTitle: "BMEYPP Champions",
		charityName: "Black and Minority Ethnic Young People's Project",
		imgName: "BMEYPP_youth_champs.jpeg",
		desc: "The BMEYPP is a youth led project for Black, Arab, Asian and Dual Heritage young people aged 11-25. The BME Youth Champions is a way in which we ensure that young people have a say in the activities that happen at the BMEEYPP and play a role in making them happen.",
	},
	{
		uuid: "f7b249b7-9552-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 2,
		opportunityTitle: "Report Writing",
		charityName: "OSCAR Foundation",
		imgName: "oscar_report_writing.jpeg",
		desc: "The OSCAR Foundation is a youth led organisation based in Mumbai which uses football as a tool to engage underprivileged girls and boys living in the slum communities in education. OSCAR has one simple rule, No School, No Football and as a result over 3,500 girls and boys are regularly attending school and taking part in OSCAR’s life skills and football programme.",
	},
	{
		uuid: "7d9da10d-92e8-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 2,
		opportunityTitle: "Records & Statistics",
		charityName: "Freedom Power Chairs",
		imgName: "stats.png",
		desc: "Your role will involve tracking information to guide workshop and fundraising efforts.",
	},
	{
		uuid: "d2b5ac05-9552-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 2,
		opportunityTitle: "Part Time Helper",
		charityName: "OSCAR Foundation",
		imgName: "oscar1.jpg",
		desc: "The OSCAR Foundation is a youth led organisation based in Mumbai which uses football as a tool to engage underprivileged girls and boys living in the slum communities in education. OSCAR has one simple rule, No School, No Football and as a result over 3,500 girls and boys are regularly attending school and taking part in OSCAR’s life skills and football programme.",
	},
	{
		uuid: "5ad1b3b8-8ca4-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 3,
		opportunityTitle: "Admin – Assistant to the Trustees",
		charityName: "Freedom Power Chairs",
		imgName: "trustees.jpg",
		desc: "We are looking for someone who can be maintaining action lists, agendas and minutes.",
	},
	{
		uuid: "9bd6f5d6-8c17-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 3,
		opportunityTitle: "Home from Hospital Volunteers",
		charityName: "Guild Care",
		imgName: "Guild_care_home_and_hosptial_volunteers.jpeg",
		desc: "This is a completely free service to any older person who lives alone and is due to be discharged from hospital. Our wonderful Home from Hospital volunteers provide social and practical support by visiting people in their own homes and assisting with things like collecting prescriptions and basic shopping, preparing a light snack, helping people to engage with activities in their local area or maybe just chatting over a cup of tea.",
	},
	{
		uuid: "845386ff-9581-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 3,
		opportunityTitle: "Assessor - Clients",
		charityName: "Freedom Power Chairs",
		imgName: "FPC2.jpg",
		desc: "We need someone who would visit our clients to conduct assessments, post phone discussion.",
	},
	{
		uuid: "0c8c3b1c-8c20-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 3,
		opportunityTitle: "Befriending an older person in the community.",
		charityName: "Time to Talk Befriending",
		imgName: "ttb_befriending_older_people.jpeg",
		desc: "Based on similar interests and hobbies befriending matches between older people and...",
		//  volunteers are made to help overcome feelings of loneliness. Many older people in our community spend days, weeks and sometimes months without anyone else to talk to.",
	},
	{
		uuid: "710627d9-9586-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 3,
		opportunityTitle: "Workshop Manager",
		charityName: "Freedom Power Chairs",
		imgName: "workshop2.jpg",
		desc: "Oversight of all activities in the workshop. Delegated in part to supervisors. We have so far been unable to obtain funding to make this a paid role.",
	},
	{
		uuid: "0c8c3b1c-8c20-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 4,
		opportunityTitle: "Befriending an older person in the community.",
		charityName: "Time to Talk Befriending",
		imgName: "ttb_befriending_older_people.jpeg",
		desc: "Based on similar interests and hobbies befriending matches between older people and volunteers are made to help overcome feelings of loneliness. Many older people in our community spend days, weeks and sometimes months without anyone else to talk to.",
	},
	{
		uuid: "25d459b7-8c18-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 4,
		opportunityTitle: "Gardening volunteer",
		charityName: "Guild Care",
		imgName: "gardening.jpg",
		desc: "Assisting Guild Care’s gardener in the grounds of our Care Homes. Will involve light gardening duties, weeding, sweeping, cutting back and as importantly sharing your ideas. ",
	},
	{
		uuid: "845386ff-9581-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 4,
		opportunityTitle: "Assessor - Clients",
		charityName: "Freedom Power Chairs",
		imgName: "FPC2.jpg",
		desc: "We need someone who would visit our clients to conduct assessments, post phone discussion.",
	},
	{
		uuid: "9bd6f5d6-8c17-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 4,
		opportunityTitle: "Home from Hospital Volunteers",
		charityName: "Guild Care",
		imgName: "Guild_care_home_and_hosptial_volunteers.jpeg",
		desc: "This is a completely free service to any older person who lives alone and is due to be discharged from hospital. Our wonderful Home from Hospital volunteers provide social and practical support by visiting people in their own homes and assisting with things like collecting prescriptions and basic shopping, preparing a light snack, helping people to engage with activities in their local area or maybe just chatting over a cup of tea.",
	},
	{
		uuid: "5ad1b3b8-8ca4-11eb-afb8-dadd5bd8c1d2",
		categoryIndex: 4,
		opportunityTitle: "Admin – Assistant to the Trustees",
		charityName: "Freedom Power Chairs",
		imgName: "trustees.jpg",
		desc: "We are looking for someone who can be maintaining action lists, agendas and minutes.",
	},
];
