<script lang="ts">
import {createEventDispatcher} from "svelte";

let {
	field,
	label,
	order,
	title = null,
	onorder = () => {},
} = $props();

</script>

<style>
#main {
	white-space: nowrap;
	cursor: pointer;
}

span.glyph {
	font-size: .8em;
	line-height: 0;
}
</style>

<div
	id="main"
	onclick={() => onorder(field)}
	{title}
>
	{label}
	{#if order?.field === field}
		<span class="glyph">
			{@html order.dir === "asc" ? "&#9206;" : "&#9207;"}
		</span>
	{/if}
</div>
