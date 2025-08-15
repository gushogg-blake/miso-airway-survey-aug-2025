import backend from "./backend";

export type Migration = (value: any, key?: any) => any | undefined;

export default class JsonStore<StoreValue = any> {
	defaultValue: StoreValue;
	
	private name: string;
	private migrations: Record<string, Migration>;
	private versions: number[];
	private latestVersion: number;
	
	constructor(name: string, defaultValue: StoreValue, migrations: Record<string, Migration>) {
		this.name = name;
		this.defaultValue = defaultValue;
		this.migrations = migrations;
		
		this.versions = Object.keys(this.migrations || {}).map(Number).sort((a, b) => a - b);
		this.latestVersion = this.versions.length > 0 ? this.versions.at(-1) : -1;
	}
	
	load(key: string): StoreValue {
		let json = backend.load(this.name, key);
		
		if (!json) {
			return this.defaultValue;
		}
		
		let {_version, value} = json;
		
		let newVersions = this.versions.filter(n => n > _version);
		
		for (let newVersion of newVersions) {
			let newValue = this.migrations[newVersion](value, key);
			
			if (newValue !== undefined) {
				value = newValue;
			}
		}
		
		if (newVersions.length > 0) {
			this.createOrUpdate(key, value);
		}
		
		return value;
	}
	
	create(key: string, value: StoreValue): void {
		return backend.create(this.name, key, this.wrap(value));
	}
	
	update(key: string, value: StoreValue): void {
		return backend.update(this.name, key, this.wrap(value));
	}
	
	createOrUpdate(key: string, value: StoreValue): void {
		return backend.createOrUpdate(this.name, key, this.wrap(value));
	}
	
	delete(key: string): void {
		return backend.delete(this.name, key);
	}
	
	wrap(value: StoreValue) {
		return {
			_version: this.latestVersion,
			value,
		};
	}
}
