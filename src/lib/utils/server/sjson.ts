import superjson from "superjson";
import {json} from "@sveltejs/kit";

export function sjson(v) {
	return json(superjson.serialize(v));
}
