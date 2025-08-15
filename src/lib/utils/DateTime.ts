import moment from "moment";
import "moment/locale/en-gb";

moment.locale("en-gb");

/*
wrapper over moment with clearer, immutable api
*/

let formats = {
	date: "YYYY-MM-DD",
	datetime: "YYYY-MM-DD HH:mm:ss",
};

let typeFromLength = {
	[formats.date.length]: "date",
	[formats.datetime.length]: "datetime",
};

export class DateTime {
	constructor(type, m) {
		this.type = type;
		this.moment = m;
		this._format = formats[type];
		this.string = this.moment.format(this._format);
		this.isDate = type === "date";
		this.isDateTime = !this.isDate;
		this.time = this.string.split(" ")[1] || null;
	}
	
	isAfter(dateTime) {
		return this.moment.isAfter(dateTime.moment);
	}
	
	isBefore(dateTime) {
		return this.moment.isBefore(dateTime.moment);
	}
	
	equals(dateTime) {
		return this.moment.isSame(dateTime.moment);
	}
	
	add(...args) {
		return new DateTime(this.type, this.moment.clone().add(...args));
	}
	
	subtract(...args) {
		return new DateTime(this.type, this.moment.clone().subtract(...args));
	}
	
	diff(dateTime, ...args) {
		return this.moment.diff(dateTime.moment, ...args);
	}
	
	fromNow() {
		return this.moment.fromNow();
	}
	
	from(dateTime) {
		return this.moment.from(dateTime.moment);
	}
	
	date() {
		return DateTime.date(this.moment.clone());
	}
	
	dateTime() {
		return new DateTime("datetime", this.moment.clone().startOf("day"));
	}
	
	at(time) {
		let date = this.string.split(" ")[0];
		
		return DateTime.fromString(date + " " + time);
	}
	
	format(...args) {
		return this.moment.format(...args);
	}
	
	toString() {
		return this.moment.format(this._format);
	}
	
	toJSON() {
		return {
			_type: "DateTime",
			value: this.string,
		};
	}
	
	static fromJson(json) {
		return DateTime.fromString(json);
	}
	
	static fromString(string) {
		let type = typeFromLength[string.length];
		let format = formats[type];
		
		let m = moment(string, format);
		
		if (!m.isValid()) {
			throw "Invalid date \"" + string + "\"";
		}
		
		return new DateTime(type, m);
	}
	
	static now() {
		return new DateTime("datetime", moment());
	}
	
	static today() {
		return new DateTime("date", moment().startOf("day"));
	}
	
	static dateTime(string) {
		return new DateTime("datetime", moment(string));
	}
	
	static date(string) {
		return new DateTime("date", moment(string));
	}
	
	static fromDb(type, string) {
		return new DateTime(type, moment(string));
	}
	
	static isDateTime(value) {
		return value instanceof DateTime;
	}
	
	static compare(a, b) {
		if (a.isAfter(b)) {
			return 1;
		} else if (a.isBefore(b)) {
			return -1;
		} else {
			return 0;
		}
	}
}
