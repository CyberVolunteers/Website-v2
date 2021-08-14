const dayLength = 24 * 60 * 60 * 1000;
export function isDateInPast(v: string) {
	const date = new Date(v);
	const currentDate = new Date();


	// see if it an invalid date
	if (isNaN(date.getDay())) return false;

	// the actual check
	const timeDifference = currentDate.getTime() - date.getTime();

	const isToday = (timeDifference < dayLength && currentDate.getDate() === date.getDate());

	// it can be the same day, just later on in the day
	if (timeDifference > 0 && !isToday) return true;
	else {
		return "Please specify a time in the past";
	}
}

export function isNonNegative(v: string){
	const int = parseInt(v);
	if(isNaN(int)) return false;
	return int >= 0;
}
