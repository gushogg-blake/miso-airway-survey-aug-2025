export let MILES_PER_METER = 0.0006213712;

let EARTH_RADIUS = 6378137;
let rad = n => (n * Math.PI) / 180;

export function getDistanceInMeters(p1, p2) {
	let dLat = rad(p2.latitude - p1.latitude); 
	let dLong = rad(p2.longitude - p1.longitude); 
	let a = Math.pow(Math.sin(dLat / 2), 2) + (Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) * Math.pow(Math.sin(dLong / 2), 2));
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	
	return EARTH_RADIUS * c;
}

// google geocoding APIs

function find(address_components, type) {
	return address_components.find(c => c.types.includes(type))?.long_name || null;
}

function getStreetAddress(streetNo, road, premise, subpremise) {
	return [
		streetNo,
		road,
		subpremise,
	].filter(Boolean).join(" ");
}

export function normaliseGeocodeResponse(res) {
	let _null = {
		street: null,
		city: null,
		state: null,
		country: null,
		postCode: null,
	};
	
	if (!res.results?.length) {
		return _null;
	}
	
	let [result] = res.results;
	let {address_components, geometry, formatted_address} = result;
	
	let premise = find(address_components, "premise");
	let subpremise = find(address_components, "subpremise");
	let streetNo = find(address_components, "street_number");
	let road = find(address_components, "route");
	
	let street = getStreetAddress(streetNo, road, premise, subpremise);
	let city = find(address_components, "locality");
	let state = find(address_components, "administrative_area_level_1");
	let country = find(address_components, "country");
	let postCode = find(address_components, "postal_code");
	
	let latitude = geometry.location.lat();
	let longitude = geometry.location.lng();
	
	let address = formatted_address;
	
	return {
		address,
		street,
		city,
		state,
		country,
		postCode,
		latitude,
		longitude,
	};
}
