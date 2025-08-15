<script lang="ts">
import { enhance } from "$app/forms"

let {
	signInPage = "signin",
	options,
	provider = "",
	authorizationParams,
	children,
} = $props();

const callbackUrl = options instanceof FormData
	? options.get("redirectTo")
	: options?.redirectTo

const redirect = options instanceof FormData ? options.get("redirect") : options?.redirectTo

const redirectTo = callbackUrl

const authorizationParamsInputs = authorizationParams
	? typeof authorizationParams === "string" && authorizationParams
		? new URLSearchParams(authorizationParams)
		: authorizationParams
	: undefined
</script>

<form
	method="POST"
	action={`/${signInPage}`}
	use:enhance
	class={`signInButton`}
>
	<input type="hidden" name="providerId" value={provider} />
	{#if callbackUrl}
		<input type="hidden" name="callbackUrl" value={callbackUrl} />
	{/if}
	{#if redirect}
		<input type="hidden" name="redirect" value={redirect} />
	{/if}
	{#if redirectTo}
		<input type="hidden" name="redirectTo" value={redirectTo} />
	{/if}
	{#if authorizationParamsInputs}
		{#each Object.entries(authorizationParamsInputs) as [key, value]}
			<input type="hidden" name={`authorizationParams-${key}`} {value} />
		{/each}
	{/if}
	<!--{#if provider === "credentials"}-->
	<!--	<slot name="credentials" />-->
	<!--{/if}-->
	<!-- TODO: Filter by provider type only -->
	<!--{#if provider === "email" || provider === "sendgrid" || provider === "resend"}-->
	<!--	<slot name="email">-->
	<!--		<label-->
	<!--			class="section-header"-->
	<!--			for={`input-email-for-email-provider`}-->
	<!--		>-->
	<!--			Email-->
	<!--		</label>-->
	<!--		<input-->
	<!--			id="input-email-for-email-provider"-->
	<!--			type="email"-->
	<!--			name="email"-->
	<!--			placeholder="email@example.com"-->
	<!--			required-->
	<!--		/>-->
	<!--	</slot>-->
	<!--{/if}-->
	{@render children()}
</form>
