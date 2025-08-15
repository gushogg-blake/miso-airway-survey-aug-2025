import {db} from "lib/server/db";
import Core from "./Core";

export type {Core};

export async function getCore() {
	return new Core(await db.getConnection());
}
