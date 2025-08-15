import superjson from "superjson";
import {randomBytes} from "node:crypto";
import {_typeof} from "utils";
import {getCore} from "lib/server/core";
import {sequence} from "@sveltejs/kit/hooks";
import {handleSession} from "svelte-kit-cookie-session";
import env from "$env/dynamic/private";

const sessionHandler = handleSession({
	secret: env.SESSION_SECRET,
});

async function init({event, resolve}) {
	let {
		locals,
		cookies,
		params,
		request,
		fetch,
		getClientAddress,
		route,
		setHeaders,
		url,
	} = event;
	
	let core = await getCore();
	let {db} = core;
	
	let uid = cookies.get("uid");
	
	if (!uid) {
		uid = randomBytes(16).toString("hex");
		
		cookies.set("uid", uid, {path:"/"});
	}

	let searchParams = processSearchParams(url.searchParams);
	
	//console.log(request);
	//console.log(request.headers.get("accept"));
	//console.log(request.headers.get("content-type"));
	
	let jsonBody = null;
	
	if (request.headers.get("content-type") === "application/json") {
		jsonBody = superjson.deserialize(await request.json());
	}
	
	event.locals = {
		db,
		core,
		searchParams,
		jsonParams: processJsonParams(searchParams),
		jsonBody,
	};
	
	return resolve(event);
}

async function close({event, resolve}) {
	let response =  await resolve(event);
	
	event.locals.core.release();
	
	return response;
}

export let handle = sequence(init, close);

function processJsonParams(searchParams) {
	if (searchParams.sjson) {
		return superjson.deserialize(JSON.parse(decodeURIComponent(searchParams.sjson)));
	} else {
		return null;
	}
}

function processSearchParams(searchParams) {
	let res = {};
	
	for (let [key, value] of searchParams.entries()) {
		if (res[key]) {
			if (_typeof(res[key]) !== "Array") {
				res[key] = [res[key]];
			}
			
			res[key].push(value);
		} else {
			res[key] = value;
		}
	}
	
	return res;
}
