import {env} from "$env/dynamic/private";
import {createDb} from "utils/server/mysql";

export let db = createDb(env);
