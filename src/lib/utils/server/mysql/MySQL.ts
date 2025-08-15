import type {ConnectionOptions, PromisePool} from "mysql2";
import mysql from "mysql2/promise";
import {_typeof} from "utils";
import Connection from "./Connection";

type Options = {
	mysql: ConnectionOptions,
	isDateTime?: (value: any) => boolean;
	createDateTime?: <T>(value: string) => T;
	jsonReviver?: (json: any) => any;
};

export default class MySQL {
	//database: string;
	minDateTime = "1000-01-01 00:00:00";
	
	private options: Options;
	private db: PromisePool;
	
	constructor(options: Options) {
		this.options = options;
		
		//this.database = options.mysql.database;
		
		this.db = mysql.createPool({
			...options.mysql,
			multipleStatements: true,
			
			ssl: {
				rejectUnauthorized: false,
			},
			
			typeCast(field, next) {
				if (field.type === "JSON") {
					return JSON.parse(field.string("utf8"), options.jsonReviver);
				} else if (field.type === "TINY") {
					let s = field.string();
					
					return s === null ? null : s === "1";
				} else if (field.type === "DATETIME") {
					let value = field.string();
					
					if (value) {
						if (options.createDateTime) {
							return options.createDateTime(value);
						} else {
							return value;
						}
					} else {
						return null;
					}
				} else {
					return next();
				}
			},
			
			queryFormat: (query: string, values): string => {
				return this.formatQuery(query, values);
			},
		});
	}
	
	async getConnection() {
		return new Connection(this, await this.db.getConnection());
	}
	
	async begin(...locks: string[]) {
		let connection = await this.getConnection();
		
		await connection.begin(...locks);
		
		return connection;
	}
	
	private escape(value: string): string {
		return this.db.escape(value);
	}
	
	private format(value: any): string {
		let type = _typeof(value);
		let {isDateTime, formatDateTime} = this.options;
		
		if (isDateTime && isDateTime(value)) {
			value = this.escape(formatDateTime ? formatDateTime(value) : value.toString());
		} else if (type === "Object" || type === "Array") {
			if (value.___isList) {
				let values = value.array.map(v => this.format(v)).join(", ");
				
				if (!values) {
					values = value.nullValue;
				}
				
				value = "(" + values + ")";
			} else {
				value = this.escape(JSON.stringify(value));
			}
		} else if (type === "Boolean") {
			value = value ? 1 : 0;
		} else {
			value = this.escape(value);
		}
		
		return value;
	}
	
	private formatQuery(query: string, values): string {
		if (_typeof(values) === "Object") {
			return query.replace(/:([a-zA-Z_]\w*)/g, (_, p) => this.format(values[p]));
		} else {
			let i = 0;
			
			return query.replace(/\?/g, _ => this.format(values[i++]));
		}
	}
	
	/*
	convenience - we often want the date when working with the db, but don't
	always want to import the date library
	*/
	
	now() {
		if (this.options.now) {
			return this.options.now();
		} else {
			return new Date().toISOString().substr(0, 19).replace("T", " ");
		}
	}
	
	end() {
		this.db.end();
	}
}
