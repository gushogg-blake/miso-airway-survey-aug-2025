import {$} from "bun";
import fs from "node:fs";

$.nothrow();

let s = fs.readFileSync(".env").toString("utf8").trim().split("\n").map(s => s.trim()).filter(Boolean);

s = s.map(l => [...l.match(/^([\w_]+)=(.+)$/)].slice(1));

for (let [k, v] of s) {
	await $`vercel env remove --yes ${k} production`;
	await $`echo "${v}" | vercel env add ${k} production`;
}
