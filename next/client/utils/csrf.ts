import {
	csrfHeaderName,
	currentPageHeaderName,
} from "../../serverAndClient/headersConfig";

export async function csrfFetch(csrfToken: string, url: string, settings: any) {
	settings.headers = settings.headers ?? {};
	settings.headers[csrfHeaderName] = csrfToken;
	settings.headers[currentPageHeaderName] = window.location.pathname;
	return await fetch(url, settings);
}
