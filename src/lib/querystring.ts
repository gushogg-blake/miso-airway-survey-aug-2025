import {_typeof} from "utils";

/*
was using kit-query-params but it doesn't seem to work well on the client,
sometimes not picking up the URL or leaving stale values in bound form
inputs

so trying this -- simple function based api, no 2 way binding

<input value={getq("key")} oninput={e => setq("key", e.target.value)}/>

maybe we could do something hacky like calling
invalidate("data:querystring") if necessary

NOTE we can still use kit-query-params on the server, to get benefits like
the schema, although might be best to simplify that out as well and use
one common lib
*/

let number = {
	encode: n => String(n),
	decode: s => Number(s),
};

let bool = {
	encode: b => String(b),
	decode: s => s === "true",
};

let encoders = {
	latitude: number,
	longitude: number,
	page: number,
	perPage: number,
	offersRemote: bool,
};

let defaults = {
	page: 1,
	perPage: 25,
};

export function getall(url) {
	if (typeof url === "string") {
		url = new URL(url);
	}
	
	let es = [...url.searchParams.entries()];
	let vs = {};
	
	for (let [k, v] of es) {
		if (encoders[k]) {
			v = encoders[k].decode(v);
		}
		
		if (k in vs) {
			if (_typeof(vs[k]) !== "Array") {
				vs[k] = [vs[k]];
			}
			
			vs[k].push(v);
		} else {
			vs[k] = v;
		}
	}
	
	for (let [k, v] of Object.entries(defaults)) {
		if (vs[k] === undefined) {
			vs[k] = v;
		}
	}
	
	return vs;
}

export function setall(url, value) {
	let u = new URLSearchParams();
	
	for (let [k, v] of Object.entries(value)) {
		if (_typeof(v) === "Array") {
			for (let item of v) {
				if (encoders[k]) {
					item = encoders[k].encode(item);
				}
				
				u.append(k, item);
			}
		} else {
			if (v !== "" && v !== null && v !== undefined) {
				if (encoders[k]) {
					v = encoders[k].encode(v);
				}
				
				u.set(k, v);
			}
		}
	}
	
	let qs = u.toString();
	
	let hash = url.hash ? "#" + page.url.hash : "";
	
	return "?" + qs + hash;
}

export function getq(url, key) {
	if (!key) {
		return getqAll(url);
	}
	
	return getall(url)[key];
}

export function mergeq(url, values) {
	return setall(url, {
		...getall(),
		...values,
	});
}

export function setq(url, key, value = "setq-undefined") {
	if (value === "setq-undefined") {
		value = key;
		
		return setqAll(url, value);
	}
	
	let all = structuredClone(getall(url));
	
	all[key] = value;
	
	return setall(url, all);
}

export function getqAll(url) {
	return getall(url);
}

export function setqAll(url, value) {
	setall(url, value);
}
