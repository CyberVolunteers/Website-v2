export const expireTimeSecondsByStore = {
	emailConfirmUUID: 15 * 60,
	passwordResetUUID: 15 * 60,
};

export const cacheExpirationSeconds = {
	postcodeByStreet: 30 * 24 * 60 * 60,
	streetByAddress: 30 * 24 * 60 * 60,
};

export const defaultSenderEmail = "noreply@cybervolunteers.org.uk";
