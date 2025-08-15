export default function(list, index, goToMinusOne=false) {
	if (index >= list.length) {
		index = goToMinusOne ? -1 : 0;
	} else if (index < 0) {
		if (goToMinusOne) {
			if (index < -1) {
				index = list.length - 1;
			}
		} else {
			index = list.length - 1;
		}
	}
	
	return index;
}
