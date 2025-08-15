import bluebird from "bluebird";
import type {Connection as MConnection} from "mysql2";
import {_typeof, mapObject} from "utils";
import {quote} from "./utils";
import type {MySQL} from ".";

export default class Connection {
	db: MySQL;
	
	private connection: MConnection;
	private locks: string[];
	
	constructor(db, connection: MConnection) {
		this.db = db;
		this.connection = connection;
		this.locks = [];
	}
	
	//get database() {
	//	return this.db.database;
	//}
	
	//async ensureDbExists() {
	//	await this.query("create database if not exists `" + this.database + "`");
	//}
	
	async release() {
		if (this.locks.length > 0) {
			await this.releaseAllLocks();
		}
		
		this.connection.release();
		
		this.connection = null;
	}
	
	async begin(...locks: string[]) {
		await this.connection.begin();
		await this.getLocks(locks);
	}
	
	async commit() {
		try {
			await this.connection.commit();
			
			if (this.locks.length > 0) {
				await this.releaseAllLocks();
			}
		} catch (e) {
			this.rollback();
			
			throw e;
		}
	}
	
	async rollback() {
		try {
			await this.connection.rollback();
		} finally {
			if (this.locks.length > 0) {
				await this.releaseAllLocks();
			}
		}
	}
	
	async getLock(name: string) {
		let acquired = await this.cell("select get_lock(:name, 5)", {name});
		
		if (acquired) {
			if (!this.connection) {
				throw new Error("Acquired lock after connection release: " + name);
			}
			
			this.locks.push(name);
		} else {
			throw new Error("Unable to get lock: " + name);
		}
	}
	
	async getLocks(names: string[]) {
		await bluebird.map(names, name => this.getLock(name));
	}
	
	async releaseLock(name: string) {
		await this.query("select release_lock(:name)", {name});
		
		this.locks = this.locks.filter(n => n !== name);
	}
	
	async releaseLocks(...names: string[]) {
		await bluebird.map(names, name => this.releaseLock(name));
	}
	
	async releaseAllLocks() {
		await this.query("select release_all_locks()");
		
		this.locks = [];
	}
	
	async query(q: string, params) {
		try {
			let [rows, fields] = await this.connection.query(q, params);
			
			return rows;
		} catch (e) {
			console.log(q);
			console.log(params);
			
			throw e;
		}
	}
	
	table(q: string, params) {
		return this.query(q, params);
	}

	async cell(q: string, params) {
		let row = await this.row(q, params);
		
		if (row) {
			return Object.values(row)[0];
		} else {
			return null;
		}
	}
	
	async col(q: string, params) {
		return (await this.query(q, params)).map(row => Object.values(row)[0]);
	}
	
	async row(q: string, params) {
		return (await this.query(q, params))[0] || null;
	}
	
	async exists(q: string, params) {
		return !!await this.row(q, params);
	}
	
	async insert(table: string, data) {
		let details;
		
		if (_typeof(data) === "Array") {
			if (data.length === 0) {
				return;
			}
			
			details = this.buildMultiInsertQuery(data);
		} else {
			details = this.buildInsertQuery(data);
		}
		
		let {fields, placeholders, values} = details;
		
		let res = await this.query(`
			insert into ${table} ${fields}
			values ${placeholders}
		`, values);
		
		return res.insertId;
	}
	
	update(table: string, where, row) {
		if (["String", "Number"].includes(_typeof(where))) {
			where = {id: where};
		}
		
		let updates = this.buildUpdateQuery(row);
		
		let whereParams = mapObject(where, function(k, v) {
			return ["where_" + k, v];
		});
		
		return this.query(`
			update ${table}
			set ${updates}
			where ${this.buildWhere(where, "where_")}
		`, {
			...row,
			...whereParams,
		});
	}
	
	upsert(table: string, row) {
		let updates = this.buildUpdateQuery(row);
		let {fields, placeholders} = this.buildInsertQuery(row);
		
		return this.query(`
			insert into ${table} ${fields}
			values ${placeholders}
			on duplicate key update ${updates}
		`, row);
	}
	
	find(table: string, fields) {
		return this.row(`
			select * from ${table}
			where ${this.buildWhere(fields)}
		`, fields);
	}
	
	findById(table: string, id) {
		return this.row(`
			select * from ${table}
			where ${this.buildWhere({id})}
		`, {id});
	}
	
	findAll(table: string, fields) {
		return this.table(`
			select * from ${table}
			where ${this.buildWhere(fields)}
		`, fields);
	}
	
	findMany(table: string, fields) {
		return this.table(`
			select * from ${table}
			where ${this.buildWhere(fields)}
		`, fields);
	}
	
	delete(table: string, id) {
		return this.query(`
			delete from ${table}
			where id = :id
		`, {id});
	}
	
	deleteMany(table: string, fields) {
		return this.query(`
			delete from ${table}
			where ${this.buildWhere(fields)}
		`, fields);
	}
	
	buildWhere(fields: Record<string, any>, prefix=""): string {
		let entries = Object.entries(fields);
		
		if (entries.length === 0) {
			return "1 = 1";
		}
		
		return entries.map(function([key, value]) {
			let paramName = prefix + key;
			
			if (value === null) {
				return "`" + key + "` is null";
			} else {
				return "`" + key + "` = :" + paramName;
			}
		}).join(" and ");
	}
	
	buildUpdateQuery(row: Record<string, any>): string {
		return Object.keys(row).map(key => "`" + key + "` = :" + key).join(", ");
	}
	
	buildInsertQuery(row: Record<string, any>) {
		let keys = Object.keys(row);
		let placeholders = keys.map(key => ":" + key);
		
		return {
			fields: "(" + keys.map(quote).join(", ") + ")",
			placeholders: "(" + placeholders.join(", ") + ")",
			values: row,
		};
	}
	
	buildMultiInsertQuery(rows: Record<string, any>[]) {
		let keys = Object.keys(rows[0]);
		let placeholders = keys.map(_ => "?").join(", ");
		
		return {
			fields: "(" + keys.map(quote).join(", ") + ")",
			placeholders: rows.map(_ => "(" + placeholders + ")").join(", "),
			values: [].concat(...rows.map(row => Object.values(row))),
		};
	}
	
	/*
	"where f in ()" is a parse error, so we specify the type of list and put
	an appropriate placeholder in if there are no values
	
	(you can do "where f in (select 0 where 0)" but apparently it's a perf
	hit because it's a "dependent subquery")
	*/
	
	list(array: any[]) {
		return {
			___isList: true,
			array,
			nullValue: "'[dummy \\'in\\' list item to avoid parse error]'",
		};
	}
	
	idList(ids: number[]) {
		return {
			___isList: true,
			array: ids,
			nullValue: 0,
		};
	}
	
	/*
	we don't know the field type when inserting/updating, so any values that
	aren't obviously json (objects/arrays) need stringifying explicitly
	*/
	
	json(value: any) {
		return JSON.stringify(value);
	}
	
	now() {
		return this.db.now();
	}
	
	end() {
		this.db.end();
	}
}
