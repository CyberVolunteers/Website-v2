export type ViewerType =
	| "loggedOut"
	| "user"
	| "org"
	| "server"
	| "hydrating"
	| "unverified_user"
	| "unverified_org";

export type ValidateClientResult = [
	{
		[key: string]: string;
	},
	{
		[key: string]: string;
	},
	{
		[key: string]: any;
	}
];

export type FormFieldCollectionData = {
	// we don't want to check the types here
	// eslint-disable-next-line
	[key: string]: any;
};

declare global {
	interface Window {
		wasHeadIncluded?: boolean;
		lastAddressSuggestionsUpdatorId?: number;
	}
}
