<script lang="ts">
import "src/app.css";
import "css/app.scss";
import Gap from "components/Gap.svelte";
import {title, questions} from "common";

let {children} = $props();
</script>

<style lang="scss">
#top {
	text-align: center;
	font-size: 1.5em;
	font-weight: bold;
	padding: 1em;
	padding-top: 2em;
}

#page {
	margin-top: 1em;
}

.col {
	max-width: 800px;
	margin: 0 auto;
	padding: 0 1em;
}

#footer {
	font-size: .9em;
	color: #606060;
	border-top: 1px solid #c0c0c0;
	padding-top: .8rem;
	
	.col > div {
	}
}

#subtitle {
	font-size: 1.2rem;
	margin-top: 1.6rem;
}
</style>

<div id="main">
	<div id="top">
		<div class="col">
			{title}
			<div id="subtitle">
				Independent Survey August 2025
			</div>
		</div>
	</div>
	<div id="page">
		<div class="col">
			{@render children()}
		</div>
	</div>
	<div class="col">
		<div id="footer">
			&copy; 2025 Gus Hogg-Blake. The code for this survey is available on <a href="//github.com/gushogg-blake/miso-airway-survey-aug-2025">GitHub</a>.
			<br><br>
			Contact: <a href="mailto:gus@gushogg-blake.com?subject=Misophonia+and+Airway%2FMyofunction+Survey">gus@gushogg-blake.com</a>
			<Gap heightEm={3}/>
		</div>
	</div>
</div>
