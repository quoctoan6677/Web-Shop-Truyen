import { apiRequest } from "./api";

export function getProfileStats(token) {
	return apiRequest("/users/profile-stats", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function updateProfile(token, payload) {
	return apiRequest("/users/profile", {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});
}
