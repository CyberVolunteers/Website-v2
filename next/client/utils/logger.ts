export function log(level: string, path: string, message: string) {
	fetch(`/api/logger`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accept: "application/json",
		},
		body: JSON.stringify({
			level,
			path,
			message,
		}),
	});
}

export function info(path: string, message: string) {
	return log("info", path, message);
}

export function error(path: string, message: string) {
	return log("error", path, message);
}
