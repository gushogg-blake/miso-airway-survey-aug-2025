export let actions = {
	default: async function({
		locals,
		cookies,
		params,
		request,
		fetch,
		getClientAddress,
		route,
		url,
	}) {
		let {core} = locals;
		
		let uid = cookies.get("uid");
		
		let data = Object.fromEntries(await request.formData());
		
		await core.submissions.add(uid, data);
	},
};
