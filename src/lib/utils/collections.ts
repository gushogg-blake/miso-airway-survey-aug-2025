import {_typeof} from "utils";

export function sortBy(list, field, desc=false) {
	let isFunction = _typeof(field) === "Function";
	
	return list.slice().sort(function(a, b) {
		let comp;
		
		if (isFunction) {
			a = field(a);
			b = field(b);
		} else {
			a = a[field];
			b = b[field];
		}
		
		if (_typeof(a) === "String" && _typeof(b) === "String") {
			comp = a.localeCompare(b);
		} else {
			a = Number(a || 0);
			b = Number(b || 0);
			
			comp = a < b ? -1 : 1;
		}
		
		return desc ? -comp : comp;
	});
}
