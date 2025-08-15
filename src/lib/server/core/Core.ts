import {type Connection} from "lib/server/db";
import Submissions from "./Submissions";

export default class Core {
	db: Connection;
	
	constructor(db: Connection) {
		this.db = db;
		
		this.submissions = new Submissions(this);
	}
	
	release() {
		this.db.release();
	}
}
