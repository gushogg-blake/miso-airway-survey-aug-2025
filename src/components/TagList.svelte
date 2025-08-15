<script lang="ts">
import {onMount, getContext} from "svelte";
import Remove from "virtual:icons/lets-icons/remove";

let {
	value,
	ondelete = () => {},
} = $props();

let removeButtonSize = 18;
</script>

<style lang="scss">
#main {
	display: flex;
	flex-direction: column;
	gap: 3px;
	height: 100px;
	border: var(--inputBorder);
	border-radius: var(--inputBorderRadius);
	padding: 3px;
	padding-right: 0;
	overflow-y: auto;
}

.tag {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.label {
	font-size: .9rem;
	//flex-grow: 1;
	border-radius: 5px;
	padding: 5px;
	background: #f5f5f5;
}

button {
	//display: flex;
	//align-items: center;
	//justify-content: center;
	//width: 20px;
	//height: 20px;
	border: 0;
	padding: 5px;
	cursor: pointer;
	background: transparent;
}

//button {
//	font-weight: bold;
//	line-height: 0;
//	text-align: center;
//	appearance: none;
//	display: flex;
//	align-items: center;
//	justify-content: center;
//	width: 20px;
//	height: 20px;
//	border: 0;
//	padding: 5px;
//	border-radius: 50%;
//	background: #f5f5f5;
//}
</style>

<div id="main" class="smallscroll">
	{#each value as item}
		<div class="tag">
			<div class="label">
				{item.label}
			</div>
			<div class="actions">
				<button onclick={() => ondelete(item.value)}>
					<Remove />
				</button>
			</div>
		</div>
	{/each}
</div>
