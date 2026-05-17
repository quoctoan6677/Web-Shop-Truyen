import { apiRequest } from "./api";

export function login(payload) {
	return apiRequest("/auth/login", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export function register(payload) {
	return apiRequest("/auth/register", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export function getMe(token) {
	return apiRequest("/auth/me", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function logout(token) {
	return apiRequest("/auth/logout", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}
