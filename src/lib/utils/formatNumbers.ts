import {_typeof} from "utils";

let priceFormatter = new Intl.NumberFormat("en-GB", {
	style: "currency",
	currency: "GBP",
	maximumFractionDigits: 2,
});

let roughFormatter = new Intl.NumberFormat("en-GB", {
	style: "currency",
	currency: "GBP",
	maximumFractionDigits: 0,
});

let numberFormatter = new Intl.NumberFormat("en-GB");

export function f(n) {
	if (_typeof(n) !== "Number" || n === 0) {
		return "0";
	}
	
	return priceFormatter.format(n);
}

export function r(n) {
	if (_typeof(n) !== "Number" || n === 0) {
		return "0";
	}
	
	return roughFormatter.format(n);
}

export function n(n) {
	if (_typeof(n) !== "Number" || n === 0) {
		return "0";
	}
	
	return numberFormatter.format(n);
}
