<script lang="ts">
import {onMount, getContext} from "svelte";

let {
	data,
	form,
} = $props();

let uid = $state(form.uid);
</script>

<style lang="scss">

</style>

<div id="main">
	<p> Thanks for taking part in the survey!
	<p> Your submission ID is <code>{uid}</code>.
	<p> <b>If you wish to update or delete your responses, save this ID now as it will not be available after closing the page!</b>
	<p> The results will be published in September 2025.
	<p> Subscribe to <a href="//misocfd.substack.com">Misophonia and Craniofacial Dystrophy</a> to receive updates.
	<br><br>
	<p align=center> <a href="/">Back to survey</a>
	<p> &nbsp;
</div>
