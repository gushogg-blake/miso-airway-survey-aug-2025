<script lang="ts">
import { onMount, getContext } from 'svelte';

let load = getContext("googleMapsLoader");

let {
	inputValue = $bindable(""),
	options = undefined,
	placeholder = undefined,
	required = false,
	pattern = undefined,
	onReady = () => {},
	onChange = () => {},
} = $props();

let inputField = $state()

onMount(async () => {
	await load("places");
	
	const autocomplete = new google.maps.places.Autocomplete(inputField, options);

	autocomplete.addListener('place_changed', () => {
		const place = autocomplete.getPlace()

		// There are circumstances where the place_changed event fires, but we
		// were NOT given location data. I only want to propagate the event if we
		// truly received location data from Google.
		// See the `Type something, no suggestions, hit Enter` test case.
		if (hasLocationData(place)) {
			setSelectedLocation({
				place: place,
				text: inputField.value,
			})
		}
	});

	onReady();
})

function emptyLocationField() {
	inputField.value = ''
	onChange(null)
}

function hasLocationData(place) {
	const fieldsToLookFor = (options && options.fields?.indexOf('ALL') === -1 && options.fields) || ['geometry']
	return place.hasOwnProperty(fieldsToLookFor[0])
}

function onInputChange() {
	if (inputField.value === '') {
		setSelectedLocation(null)
	}
}

function onKeyDown(event) {
	const suggestionsAreVisible = document.getElementsByClassName('pac-item').length

	if (event.key === 'Enter' || event.key === 'Tab') {
		//debugger;
		if (suggestionsAreVisible) {
			const isSuggestionSelected = document.getElementsByClassName('pac-item-selected').length
			if (!isSuggestionSelected) {
				selectFirstSuggestion()
			}
		}
	} else if (event.key === 'Escape') {
		setTimeout(emptyLocationField, 10)
	}

	if (suggestionsAreVisible) {
		if (event.key === 'Enter') {
			/* When suggestions are visible, don't let an 'Enter' submit a form (since
			 * the user is interacting with the list of suggestions at the time, not
			 * expecting their actions to affect the form as a whole). */
			event.preventDefault()
		}
	}
}

function selectFirstSuggestion() {
	// Simulate the 'down arrow' key in order to select the first suggestion:
	// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
	const simulatedEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 })
	inputField.dispatchEvent(simulatedEvent)
}

function setSelectedLocation(data) {
	onChange(data);
}
</script>

<style lang="scss">
input {
	@media (max-width: 649px) {
		//width: 120px;
	}
}
</style>

<input
	type="text"
	bind:this={inputField}
	bind:value={inputValue}
	onchange={onInputChange}
	onkeydown={onKeyDown}
	{placeholder}
	{required}
	{pattern}
/>
