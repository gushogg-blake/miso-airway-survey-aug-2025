<script lang="ts">
import {onMount, getContext, tick} from "svelte";
import bodyClickOrMousedown from "utils/dom/bodyClickOrMousedown";
import screenOffsets from "utils/dom/screenOffsets";
import {_typeof, lid, sortBy} from "utils";
import {isArrow, dirUpDown} from "utils/dom/keyEvents";
import wrapAround from "utils/wrapAround";
import Checkbox from "virtual:icons/mdi/checkbox-marked-circle";

let {
	disabled = false,
	options,
	value = [],
	ontoggle = () => {},
	//onchange = () => {},
	fullWidth = false,
	id = null,
} = $props();

let form = getContext("form");

let list = $state();
let control = $state();

//let id = lid();
let main = $state();
let scrollContainer = $state();
let focused = $state(false);
let showingList = $state(false);
let inputValue = $state("");
let focusedOption = $state();
let listDownwards = $state();
let anchorLeft = $state();

let valueSet = $derived(new Set(value));

let filteredOptions = $derived.by(function() {
	if (!inputValue) {
		return options;
	}
	
	let matchingOptions = options.filter(function(option) {
		if (option.type === "groupHeader") {
			return false;
		}
		
		return option.label.toLowerCase().includes(inputValue.toLowerCase());
	});
	
	let matchingHeaders = options.filter(function(option) {
		if (option.type !== "groupHeader") {
			return false;
		}
		
		return matchingOptions.some(o => o.groupValue === option.value);
	});
	
	let matchingValues = new Set([
		...matchingOptions.map(o => o.value),
		...matchingHeaders.map(h => h.value),
	]);
	
	return options.filter(function(option) {
		return matchingValues.has(option.value);
	});
});

$effect(() => {
	if (inputValue === "") {
		focusedOption = null;
	}
});

let showInProgress = false;

async function showList() {
	showInProgress = true;
	showingList = true;
	listDownwards = true;
	anchorLeft = true;
	
	await tick();
	
	let {
		height,
		left,
		bottom,
		right,
	} = screenOffsets(list);
	
	let {
		top,
	} = screenOffsets(control);
	
	listDownwards = bottom >= 0 || top - height < 0;
	anchorLeft = right >= 8;
	
	setTimeout(function() {
		showInProgress = false;
	}, 0);
}

function hideList() {
	showingList = false;
}

function close() {
	hideList();
	
	inputValue = "";
}

function click() {
	//if (showingList) {
	//	close();
	//} else {
	//	showList();
	//}
}

function toggle(e, option) {
	e.preventDefault();
	e.stopPropagation();
	
	//close();
	
	ontoggle(option);
	//if (mode === "tags") {
	//	onselect(option);
	//} else {
	//	value = option[optionValueKey];
	//	
	//	onchange();
	//}
}

function keydown(e) {
	if (e.key === "Tab" && focusedOption) {
		select(focusedOption);
	}
	
	if (isArrow(e)) {
		let dir = dirUpDown(e);
		
		if (showingList) {
			if (dir) {
				e.preventDefault();
				
				let focusedIndex = filteredOptions.indexOf(focusedOption);
				let newIndex = wrapAround(filteredOptions, focusedIndex + dir, true);
				
				focusedOption = filteredOptions[newIndex] || null;
			}
		} else {
			showList();
		}
	}
}

function keypress(e) {
	if (e.key === "Enter") {
		if (showingList) {
			e.preventDefault();
			
			if (focusedOption) {
				select(focusedOption);
			}
		} else {
			if (form) {
				form.submit();
			}
		}
		
		hideList();
	}
}

function onfocus() {
	showList();
}

function onblur() {
	
}

function inputClick() {
	showList();
}

function arrowMousedown(e) {
	e.preventDefault();
	e.stopPropagation();
	
	if (showingList) {
		close();
	} else {
		showList();
	}
}

onMount(function() {
	return bodyClickOrMousedown("mousedown", close, () => [
		$state.snapshot(main),
	]);
});
</script>

<style lang="scss">
#main {
	
}

#wrapper {
	position: relative;
}

#control {
	display: flex;
	align-items: stretch;
	border: var(--inputBorder);
	border-radius: var(--inputBorderRadius);
	//cursor: pointer;
	background: white;
}

input {
	flex-grow: 1;
	border: 0;
}

#value {
	flex-grow: 1;
	padding-right: .5em;
}

#listAnchor {
	position: absolute;
	left: 0;
	width: 100%;
	
	&.listDownwards {
		bottom: 0;
	}
	
	&.listUpwards {
		top: 0;
	}
}

#list {
	position: absolute;
	z-index: 10;
	display: flex;
	flex-direction: column;
	width: 240px;
	min-width: 100%;
	max-height: 300px;
	border: var(--inputBorder);
	border-radius: 8px;
	background: white;
	
	.listDownwards & {
		top: 2px;
	}
	
	.listUpwards & {
		bottom: 2px;
	}
	
	.anchorLeft & {
		left: 0;
	}
	
	.anchorRight & {
		right: 0;
	}
}

#options {
	flex-grow: 1;
	padding: 3px;
	overflow: auto;
}

.groupHeader {
	font-weight: bold;
	padding: 3px;
}

.option {
	display: flex;
	gap: 4px;
	border-radius: 3px;
	padding: 5px;
	cursor: pointer;
	
	&.inGroup {
		padding-left: 10px;
	}
	
	&:not(:last-child) {
		margin-bottom: 2px;
	}
	
	&:hover {
		background: #F2F2F2;
	}
	
	&.focused {
		background: #F2F2F2;
	}
	
	.label {
		flex-grow: 1;
	}
}

.fullWidth {
	width: 100%;
}
</style>

<div id="main" bind:this={main} class={{fullWidth}}>
	<div id="wrapper">
		<div id="control" bind:this={control} class={{showingList}}>
			<input
				{id}
				bind:value={inputValue}
				onkeydown={keydown}
				onkeypress={keypress}
				onfocus={onfocus}
				onblur={onblur}
				onclick={inputClick}
			/>
			<!--<div id="arrow" onmousedown={arrowMousedown}>-->
			<!--	arrow-->
			<!--</div>-->
		</div>
		{#if showingList}
			<div
				id="listAnchor"
				class={{listDownwards, listUpwards: !listDownwards, anchorLeft, anchorRight: !anchorLeft}}
			>
				<div id="list" bind:this={list}>
					<div id="options" class="smallscroll" bind:this={scrollContainer}>
						{#each filteredOptions as option}
							{#if option.type === "groupHeader"}
								<div class="groupHeader">
									{option.label}
								</div>
							{:else}
								<div
									class={[
										"option",
										{
											focused: focusedOption === option,
											inGroup: !!option.groupValue,
										},
									]}
									onclick={(e) => toggle(e, option)}
									title={option.label}
								>
									<div class="label">
										{option.label}
									</div>
									{#if valueSet.has(option.value)}
										<Checkbox/>
									{/if}
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
