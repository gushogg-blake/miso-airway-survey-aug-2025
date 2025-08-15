import {apiGet, apiPost} from "lib/clientApi";

export async function updateProvider(details) {
	return await apiPost("/api/admin/providers/update", details);
}

export async function bulkUpdate(rows) {
	return await apiPost("/api/admin/providers/bulk-update", rows);
}

export async function getProviders(params, _f) {
	return await apiGet("/api/admin/providers", params);
}

export async function createProvider(details) {
	return await apiPost("/api/admin/providers/create", details);
}
