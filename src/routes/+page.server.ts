export let load = async function({locals}) {
	let {core} = locals;
	
	return {
		submissionsReceived: await core.submissions.count(),
	};
}
