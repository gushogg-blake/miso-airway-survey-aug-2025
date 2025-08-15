import superjson from "superjson";

export async function apiGet(url, jsonParams, _f) {
	let sjsonParams = superjson.serialize(jsonParams || null);
	let res = await (_f || fetch)(url + "?sjson=" + encodeURIComponent(JSON.stringify(sjsonParams)));
	let sjsonResponse = await res.json();
	let jsonRes = superjson.deserialize(sjsonResponse);
	
	return jsonRes;
}

export async function apiPost(url, body, _f) {
	let res = await (_f || fetch)(url, {
		method: "post",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(superjson.serialize(body)),
	});
	
	return superjson.deserialize(await res.json());
}

export async function fetchQuery(url, jsonParams, _f) {
	try {
		let jsonRes = await apiGet(url, jsonParams, _f);
		
		return {success: true, data: jsonRes};
	} catch (e) {
		return {success: false, error: e};
	}
}

export async function getProviders(params, _f) {
	return await apiGet("/api/providers", params, _f);
}

export async function toggleBookmark(providerId, on) {
	return apiPost("/api/toggle-bookmark", {
		providerId,
		on,
	});
}
