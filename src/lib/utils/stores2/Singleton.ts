import JsonStore, {type Migration} from "./JsonStore.svelte";

export default class Singleton<StoreValue = any> {
	private store: JsonStore<StoreValue>;
	
	constructor(name: string, defaultValue: StoreValue, migrations: Record<string, Migration>) {
		this.store = new JsonStore<StoreValue>(name, defaultValue, migrations);
	}
	
	get defaultValue() {
		return this.store.defaultValue;
	}
	
	load(): StoreValue {
		return this.store.load("default");
	}
	
	save(value: StoreValue): void {
		return this.store.createOrUpdate("default", value);
	}
}
