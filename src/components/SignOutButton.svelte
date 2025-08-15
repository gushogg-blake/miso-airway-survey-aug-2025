<script lang="ts">
import { enhance } from "$app/forms"

let {
	options,
	signOutPage = "signout",
	children,
} = $props();
</script>

<form
	method="POST"
	action={`/${signOutPage}`}
	use:enhance
>
	{#if options}
		{#if options?.redirect}
			<input type="hidden" name="redirect" value={options.redirect} />
		{/if}
		{#if options?.redirectTo}
			<input type="hidden" name="redirectTo" value={options.redirectTo} />
		{/if}
	{/if}
	{@render children()}
</form>
