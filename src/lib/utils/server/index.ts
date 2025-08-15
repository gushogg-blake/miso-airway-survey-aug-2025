import {createHash} from "node:crypto";

export {default as fs} from "./fs";
export {sjson} from "./sjson";

export function shortHash(str) {
	return createHash('sha256').update(str).digest('hex').substr(0, 6);
}
