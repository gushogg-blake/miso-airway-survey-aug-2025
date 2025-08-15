import localStorage from "./localStorage";

function storageKey(name: string, key?: string) {
	let parts = [encodeURIComponent(name)];
	
	if (key) {
		parts.push(encodeURIComponent(key));
	}
	
	return parts.join("/");
}

export default {
	load(name, key) {
		return localStorage.get(storageKey(name, key));
	},
	
	update(name, key, data) {
		if (!this.has(name, key)) {
			throw new Error("Item doesn't exist: " + storageKey(name, key));
		}
		
		localStorage.set(storageKey(name, key), data);
	},
	
	create(name, key, data) {
		if (this.has(name, key)) {
			throw new Error("Item already exists: " + storageKey(name, key));
		}
		
		localStorage.set(storageKey(name, key), data);
	},
	
	createOrUpdate(name, key, data) {
		if (this.has(name, key)) {
			return this.update(name, key, data);
		} else {
			return this.create(name, key, data);
		}
	},
	
	ls(name) {
		let prefix = storageKey(name) + "/";
		
		return localStorage.keys().filter(key => key.startsWith(prefix)).map(key => decodeURIComponent(key.substr(prefix.length)));
	},
	
	has(name, key) {
		return localStorage.has(storageKey(name, key));
	},
	
	delete(name, key) {
		if (!this.has(name, key)) {
			throw new Error("Item doesn't exist: " + storageKey(name, key));
		}
		
		localStorage.remove(storageKey(name, key));
	},
};
