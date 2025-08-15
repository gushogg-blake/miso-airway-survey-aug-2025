<script lang="ts">
import {onMount, getContext} from "svelte";
import {lid, slugify} from "utils";

let {
	name,
	options,
	value = $bindable(),
	ariaLabelledBy,
} = $props();

let prefix = lid();

function onclick(v) {
	toggle(v);
}

function toggle(v) {
	if (value === v) {
		value = undefined;
	} else {
		value = v;
	}
}

function onkeydown(e, v, id) {
	if (e.key === " " || e.key === "Spacebar") {
		e.preventDefault();
		
		toggle(v);
	} else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
		e.preventDefault();
		
		move(1);
	} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
		e.preventDefault();
		
		move(-1);
	}
}

function move(dir) {
	let all = [...main.querySelectorAll("[role='radio']")];
	let index = all.indexOf(document.activeElement);
	let newIndex = index + dir;
	
	if (newIndex === -1) {
		newIndex = all.length - 1;
	} else if (newIndex === all.length) {
		newIndex = 0;
	}
	
	all[newIndex].focus();
}

let radios = $state({});
let main = $state();
</script>

<style lang="scss">
#main {
	display: flex;
	gap: 1em;
}

.option {
	user-select: none;
	display: flex;
	//justify-content: center;
	align-items: center;
	gap: 2.3em;
	//width: 150px;
	border: 1px solid #c1c5cd;
	border-radius: 8px;
	padding: .7em 1em;
	padding-right: 4.2em;
	cursor: pointer;
	
	&.selected {
		border: 1px solid #5774b5;
		box-shadow: 0 0 5px -2px rgba(0, 0, 0, 0.2);
		background: #e7effb;
	}
	
	&:not(.selected):hover {
		box-shadow: 0 0 8px -3px rgba(0, 0, 0, 0.3);
	}
	
	&:not(.selected):active {
		//background: #f0f0f0;
	}
	
	&.selected:active {
		//background: #e1e6ed;
	}
}

.label {
	
}

.circle {
	--size: 20px;
	
	width: var(--size);
	height: var(--size);
	border: 1px solid #c1c5cd;
	border-radius: 50%;
	background: white;
	
	.selected & {
		border: 1px solid #9da8bf;
	}
	
	.inner {
		width: calc(var(--size) - 10px);
		height: calc(var(--size) - 10px);
		margin: 4px;
		border-radius: 50%;
		
		.selected & {
			background: #1c4b91;
		}
	}
}

.option:focus {
	outline: 1px solid #2e3850;
	box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.3);
}
</style>

<div bind:this={main} id="main" role="radiogroup" aria-labelledby={ariaLabelledBy}>
	<input type="hidden" {name} {value}>
	{#each options as v, i}
		{@const id = prefix + "_" + slugify(v)}
		<div
			role="radio"
			tabindex={i === 0 ? 0 : -1}
			class={["option", {selected: value === v}]}
			aria-labelledby={id}
			aria-checked={value === v}
			onclick={e => onclick(v)}
			onkeydown={e => onkeydown(e, v, id)}
			bind:this={radios[id]}
		>
			<div class="circle">
				<div class="inner">
					
				</div>
			</div>
			<div {id} class="label">
				{v}
			</div>
		</div>
	{/each}
</div>
