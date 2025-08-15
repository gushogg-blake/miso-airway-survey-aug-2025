import path from "path";
import adapter from "@sveltejs/adapter-vercel";
import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";
import {mdsvex} from "mdsvex";

export default {
	extensions: [".svelte", ".md"],
	
	preprocess: [
		vitePreprocess(),
		
		mdsvex({
			extensions: [".md"],
			
			smartypants: {
				dashes: "oldschool",
			},
		}),
	],
	
	kit: {
		adapter: adapter(),
		
		alias: {
			src: path.resolve("./src"),
			css: path.resolve("./src/css"),
			lib: path.resolve("./src/lib"),
			core: path.resolve("./src/lib/core"),
			common: path.resolve("./src/lib/common"),
			utils: path.resolve("./src/lib/utils"),
			components: path.resolve("./src/components"),
			routes: path.resolve("./src/routes"),
			pages: path.resolve("./src/pages"),
		},
	},
	
	onwarn() {},
};
