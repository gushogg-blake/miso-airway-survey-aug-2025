import {DateTime} from "luxon";
import {ConnectionConfig} from "mysql2";
import MySQL from "./MySQL";

export type {MySQL};

export function createDb(env) {
	let {MYSQL_URL} = env;
	
	let config = ConnectionConfig.parseUrl(MYSQL_URL);
	
	return new MySQL({
		mysql: config,
		
		createDateTime(str) {
			return DateTime.fromSQL(str).toJSDate();
		},
		
		isDateTime(value) {
			return value instanceof Date;
		},
		
		formatDateTime(value) {
			return DateTime.fromJSDate(value).toFormat("yyyy-LL-dd HH:mm:ss");
		},
	});
}
