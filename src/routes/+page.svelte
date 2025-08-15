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
.q {
	display: flex;
	flex-direction: column;
	gap: 1.5em;
}

.prompt {
	font-weight: bold;
}

#actions {
	display: flex;
	justify-content: center;
	padding: 2em;
	
	button {
		font-family: inherit;
		font-size: inherit;
		color: #edf2f9;
		display: block;
		padding: .8em 1.6em;
		border-radius: 8px;
		cursor: pointer;
		background: #1c4b91;
	}
}

#details {
	font-size: .9em;
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

ol {
	li:not(:last-child) {
		margin-bottom: 3em;
	}
}

ol::marker {
	font-family: var(--fontFamily);
}
</style>

<div id="main">
	<div id="intro">
		<p> This is an independent, preliminary investigation into the connection between misophonia and airway/myofunctional health. The results will be used to inform patient advocacy regarding future research directions.
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
	<Gap heightEm={1}/>
	<div id="subtitle">
		Questions
	</div>
	<Gap heightEm={1}/>
	<div id="info">
		<p> All questions are optional.</p>
	</div>
	<form method="POST" action="/submit">
		<input type="hidden" name="questions" value={JSON.stringify(questions)}>
		<ol>
			{#each questions as {type, q}, i}
				{@const id = "q-" + i}
				<li>
					<div class="q">
						<div class="prompt" {id}>
							<!--{i + 1}. {q}-->
							{q}
						</div>
						<div class="options">
							<Radio ariaLabelledBy={id} name={"q_" + i} options={options[type]}/>
						</div>
					</div>
				</li>
			{/each}
		</ol>
		<div id="actions">
			<button type="submit">Submit</button>
		</div>
	</form>
</div>
