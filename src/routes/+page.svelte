<script lang="ts">
import {onMount, getContext} from "svelte";
import Radio from "components/Radio.svelte";
import Gap from "components/Gap.svelte";
import {questions} from "common";
import Info from "virtual:icons/gridicons/info";

let {
	data,
} = $props();

let submissionsReceived = $state(data.submissionsReceived);

let options = {
	yesno: ["Yes", "No"],
	yesnonotsure: ["Yes", "No", "Not sure"],
	suction: ["Yes", "Only the tip", "No", "Not sure"],
};
</script>

<style lang="scss">
#details {
	font-size: .9em;
	border-bottom: 1px solid #c0c0c0;
	padding-bottom: 1em;
}

#info {
	font-size: .9em;
	border-radius: 8px;
	padding: .8rem;
	background: #f0f0f0;
}

form {
	margin-top: 2em;
}

table {
	td, th {
		border: 0;
		padding: .5em 0;
	}
	
	th {
		width: 120px;
	}
}

#subtitle {
	font-size: 1.2rem;
	font-weight: bold;
	text-align: center;
}

.item {
	display: flex;
	gap: .5em;
	
	&:not(:last-child) {
		margin-bottom: 3em;
	}
}

.marker {
	font-weight: bold;
	margin-left: 1.5em;
}

.q {
	display: flex;
	flex-direction: column;
	gap: 1.2em;
}

.prompt {
	font-weight: bold;
}

#actions {
	display: flex;
	justify-content: center;
	//padding: 2em;
	
	button {
		font-family: inherit;
		font-size: inherit;
		color: #edf2f9;
		display: block;
		padding: .8em 1.6em;
		border: 2px solid #0b2c5c;
		border-radius: 8px;
		cursor: pointer;
		background: #1c4b91;
	}
}
</style>

<div id="main">
	<div id="intro">
		<p> This is an independent, preliminary investigation into the connection between misophonia and airway/myofunctional health. The results will be used to inform patient advocacy on future research directions.
		<p> Submissions are anonymous. After completing the survey, you will be given a unique ID to manage your submission.
	</div>
	<Gap heightEm={1}/>
	<div id="details">
		<table>
			<tbody>
				<tr>
					<th>Organiser</th>
					<td>Gus Hogg-Blake</td>
				</tr>
				<tr>
					<th>Start date</th>
					<td>15 August 2025</td>
				</tr>
				<tr>
					<th>End date</th>
					<td>15 September 2025</td>
				</tr>
				<!--<tr>-->
				<!--	<th>Submissions received</th>-->
				<!--	<td>{submissionsReceived}</td>-->
				<!--</tr>-->
			</tbody>
		</table>
	</div>
	<Gap heightEm={2}/>
	<div id="subtitle">
		Questions
	</div>
	<Gap heightEm={2}/>
	<div id="info">
		<p> All questions are optional.</p>
	</div>
	<form method="POST" action="/submit">
		<input type="hidden" name="questions" value={JSON.stringify(questions)}>
		<div id="items">
			{#each questions as {type, q}, i}
				{@const id = "q-" + i}
				<div class="item">
					<div class="marker">
						{i + 1}.
					</div>
					<div class="q">
						<div class="prompt" {id}>
							<!--{i + 1}. {q}-->
							{q}
						</div>
						<div class="options">
							<Radio ariaLabelledBy={id} name={"q_" + i} options={options[type]}/>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<Gap heightEm={2}/>
		<div id="actions">
			<button type="submit">Submit responses</button>
		</div>
	</form>
</div>
