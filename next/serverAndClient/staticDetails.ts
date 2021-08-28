import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const contactEmail = "hello@cybervolunteers.org.uk";
export const notificationsEmail = "hello@cybervolunteers.org.uk";
export const baseListingImagePath = "/userUploads/images/listingImages/";
export const minPasswordScore = 3;
export const allowedFileTypes = [".jpeg", ".jpg", ".png", ".webp"];
export const relativeDistanceSearchValue = 0.75;

export const protocolAndHost = publicRuntimeConfig.IS_DEV
	? "http://localhost:3000"
	: "https://cybervolunteers";
