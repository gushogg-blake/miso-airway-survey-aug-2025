export function isArrow(e) {
	return [
		"LeftArrow",
		"UpArrow",
		"RightArrow",
		"DownArrow",
	].includes(e.key);
}

export function dirUpDown(e) {
	if (e.key === "UpArrow") {
		return -1;
	} else if (e.key === "DownArrow") {
		return 1;
	} else {
		return null;
	}
}
