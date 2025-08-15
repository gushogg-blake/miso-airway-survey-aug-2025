import {createDb} from "utils/server/mysql";

console.log("Creating db pool for " + process.env.MYSQL_URL);

export let db = createDb(process.env);

export function getConnection() {
	return db.getConnection();
}
