export default function(obj, fn) {
	let result = {};
	
	for (let k in obj) {
		let [newKey, newVal] = fn(k, obj[k]);
		
		result[newKey] = newVal;
	}
	
	return result;
}
