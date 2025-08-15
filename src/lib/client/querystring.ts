import * as base from "lib/querystring";

import {goto, replaceState} from '$app/navigation';
import {page} from "$app/state";

function getall() {
	return base.getall(page.url);
}

function setall(value) {
	let s = base.setall(page.url, value);
	
	goto(s, {
		replaceState: true,
		keepFocus: true,
		noScroll: true,
	});
}

export function getq(key) {
	if (!key) {
		return getqAll();
	}
	
	return getall()[key];
}

export function mergeq(values) {
	setall({
		...getall(),
		...values,
	});
}

export function setq(key, value = "setq-undefined") {
	if (value === "setq-undefined") {
		value = key;
		
		return setqAll(value);
	}
	
	let all = structuredClone(getall());
	
	all[key] = value;
	
	setall(all);
}

export function getqAll() {
	return getall();
}

export function setqAll(value) {
	setall(value);
}
