import {_typeof, removeInPlace} from "utils";
import {on} from "utils/dom/domEvents";

export default function(event, callback, filter) {
	let teardown = on(document.body, event, function(e) {
		let excludeEls = filter();
		
		let node = e.target;
		
		while (node) {
			if (excludeEls.includes(node)) {
				return;
			}
			
			node = node.parentElement;
		}
		
		callback();
	});
	
	return teardown;
}
