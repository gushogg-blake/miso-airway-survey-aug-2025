import {default as _slugify} from "slugify";
//import {DateTime} from "luxon";

export {default as Evented} from "./Evented";
export {default as lid} from "./lid";
export {default as sleep} from "./sleep";
export {default as promiseWithMethods, type PromiseWithMethods} from "./promiseWithMethods";
export {default as _typeof} from "./typeof";
export {default as throttle} from "./throttle";
export {default as mapArrayToObject} from "./mapArrayToObject";
export {default as mapObject} from "./mapObject";
export * from "./array";
export * from "./collections";
export type * from "./types";

export function providerName(provider) {
	if (provider.type === 'institution' || provider.isBrandName) {
		return provider.name;
	}
	
	let designations = provider.designation?.split(", ") || [];
	
	let isdr = provider.isDoctor || designations.some(d => ["BDS", "PhD", "DDS", "DMD", "MD"].includes(d));
	
	if (isdr) {
		return "Dr " + provider.name;
	} else {
		return provider.name;
	}
}

export function websiteHref(website) {
	if (!website) {
		return null;
	}
	
	return website.startsWith("http") ? website : "http://" + website;
}

export function websiteUrl(website) {
	if (!website) {
		return null;
	}
	
	return website.startsWith("http") ? website : "http://" + website;
}

export function websiteLabel(website) {
	if (!website) {
		return null;
	}
	
	let label = website.replace(/^https?:\/\//, "");
	
	label = label.replace(/(\.\w+)\/$/, "$1").toLowerCase();
	
	return label;
}

export function debounce(fn, delay) {
	let timeoutId;
	
	return function (...args) {
		clearTimeout(timeoutId);
		
		timeoutId = setTimeout(() => {
			fn(...args);
		}, delay);
	}
}

export function slugify(str) {
	return _slugify(str.replace(/[^\w\s]/g, "")).toLowerCase();
}

export function noId(obj) {
	let _new = JSON.parse(JSON.stringify(obj));
	
	delete _new.id;
	
	return _new;
}

export function cleanForInsert(row) {
	let _new = structuredClone(row);
	
	delete _new.id;
	
	for (let k of Object.keys(_new)) {
		if (k.startsWith("_")) {
			delete _new[k];
		}
	}
	
	return _new;
}
