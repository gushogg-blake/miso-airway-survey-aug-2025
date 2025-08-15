<script lang="ts">
import {onMount, getContext} from "svelte";
import {n} from "utils/formatNumbers";

let {
	data,
	form,
} = $props();

let uid = $state(form?.uid);
let submissionsReceived = $state(data.submissionsReceived);

console.log(submissionsReceived);
</script>

<style lang="scss">

</style>

<div id="main">
	<p> Thanks for taking part in the survey!</p>
	{#if uid}
		<p> Your submission ID is <code>{uid}</code>.</p>
		<p> <b>If you wish to update or delete your responses, save this ID now as it will not be available after closing the page!</b></p>
	{/if}
	<p> The results will be published in September 2025.</p>
	<p> Subscribe to <a href="//misocfd.substack.com">Misophonia and Craniofacial Dystrophy</a> to receive updates.</p>
	<p> Submissions received: {n(submissionsReceived)}.</p>
	<p align=center> <a href="/">Back to survey</a></p>
	<p> &nbsp;</p>
</div>
