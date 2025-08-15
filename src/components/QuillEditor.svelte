<script>
import { onMount } from "svelte";

let {
	value = $bindable(),
} = $props();

let quill;

let editor = $state.raw();

let editing = false;

$effect(() => {
	if (!editing && editor) {
		editor.innerHTML = value;
	}
});

onMount(() => {
	quill = new Quill(editor, {
		theme: "snow",
	});
	
	quill.on("text-change", () => {
		editing = true;
		
		value = quill.root.innerHTML;
		
		setTimeout(function() {
			editing = false;
		}, 0);
	});
	
	quill.setText(value);
	
	return function() {
		editor.innerHTML = "";
	}
});
</script>

<style lang="scss">
div {
	width: 100%;
}
</style>

<div bind:this={editor}></div>
