<script lang="ts">
import {onMount, getContext} from "svelte";

let {
	value = $bindable(""),
	oninput,
	...rest
} = $props();

let focused = $state(false);

let inputValue = $state(value);

$effect(() => {
	if (!focused) {
		inputValue = value;
	}
});
</script>

<style lang="scss">

</style>

<input {oninput} value={inputValue} onfocus={e => focused = true} onblur={e => focused = false} {...rest}/>
