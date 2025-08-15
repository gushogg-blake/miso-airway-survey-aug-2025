<script lang="ts">
import {onMount, getContext} from "svelte";
import {_typeof} from "utils";
import First from "virtual:icons/material-symbols/first-page-rounded";
import Last from "virtual:icons/material-symbols/last-page-rounded";
import Previous from "virtual:icons/material-symbols/chevron-left-rounded";
import Next from "virtual:icons/material-symbols/chevron-right-rounded";

let {
	page,
	pages,
	onPageChange = () => {},
	loading = false,
} = $props();

let _page = $derived(_typeof(page) === "Number" && isFinite(page) ? page : 1);
let _pages = $derived(_typeof(pages) === "Number" && isFinite(pages) ? pages : 0);
</script>

<style lang="scss">
#main {
	display: flex;
	align-items: stretch;
	gap: 5px;
	
	.buttonLink {
		border: var(--accentBorder);
		//background: #;
	}
}

button {
	
}
</style>

<div id="main">
	<button aria-description="First page" class="buttonLink" disabled={_page === 1} onclick={() => onPageChange(1)}>
		<First/>
	</button>
	<button aria-description="Previous page" class="buttonLink" disabled={_page === 1} onclick={() => onPageChange(_page - 1)}>
		<Previous/>
	</button>
	<select disabled={loading} aria-description="Select page" value={_page} onchange={(e) => onPageChange(Number(e.target.value))}>
		{#each "p".repeat(_pages) as _, i}
			{@const n = i + 1}
			<option aria-label={n} value={n}>Page {n} of {_pages}</option>
		{/each}
	</select>
	<button aria-description="Next page" class="buttonLink" disabled={_page === _pages} onclick={() => onPageChange(_page + 1)}>
		<Next/>
	</button>
	<button aria-description="Last page" class="buttonLink" disabled={_page === _pages} onclick={() => onPageChange(_pages)}>
		<Last/>
	</button>
</div>
