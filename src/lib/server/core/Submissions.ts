import type {Core} from "server/core";
import {env} from "$env/dynamic/private";

let surveyId = env.SURVEY_ID;

export default class Submissions {
	private core: Core;
	
	constructor(core: Core) {
		this.core = core;
	}
	
	get db() {
		return this.core.db;
	}
	
	async add(uid, data) {
		await this.db.insert("submissions", {
			surveyId,
			uid,
			submittedAt: new Date(),
			data,
		});
	}
	
	async count() {
		return await this.db.cell("select count(distinct uid) from submissions where surveyId = :surveyId", {
			surveyId,
		});
	}
}
