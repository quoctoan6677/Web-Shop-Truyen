const API_BASE_URL =
	import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

async function parseResponse(response) {
	const data = await response.json().catch(() => null);

	if (!response.ok) {
		throw new Error(data?.message || "Co loi xay ra tu server.");
	}

	return data;
}

export async function apiRequest(endpoint, options = {}) {
	const { headers = {}, ...restOptions } = options;

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...restOptions,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	});

	return parseResponse(response);
}
