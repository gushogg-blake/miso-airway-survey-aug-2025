<script lang="ts">
import {onMount, getContext} from "svelte";
import {on} from "utils/dom/domEvents";

let {
	onclose = () => {},
	children,
} = $props();

let back = $state();

function close() {
	onclose();
}

function keyup(e) {
	let target = e.target;
	let node = target;
	
	while (node) {
		if (["INPUT", "SELECT"].includes(node.nodeName)) {
			return;
		}
		
		node = node.parentElement;
	}
	
	if (e.key === "Escape") {
		close();
	}
}

//onMount(function() {
//	let teardown = [
//		on($state.snapshot(back), "wheel", function(e) {
//			// doesn't work for some reason
//			e.stopPropagation();
//		}, {
//			passive: false,
//		}),
//	];
//	
//	return function() {
//		for (let fn of teardown) {
//			fn();
//		}
//	}
//});
</script>

<style>
#back {
	position: fixed;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 1em;
	overflow-y: auto;
	background: #0000000d;
}
</style>

<svelte:window on:keyup={keyup}/>

<div id="back" bind:this={back} onclick={close}>
	{@render children()}
</div>
