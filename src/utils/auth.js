import { adminMockAccount, userMockPassword } from "../data/auth";
import { getMe, login, logout, register } from "../services/authService";
import { clearUserProfile, saveUserProfile } from "./userProfile";

const AUTH_STORAGE_KEY = "shop-truyen-auth-session";

export function getLoginCredentials() {
	return {
		user: {
			email: "toanpham@example.com",
			password: userMockPassword,
			role: "user",
		},
		admin: adminMockAccount,
	};
}

export function getAuthSession() {
	if (typeof window === "undefined") {
		return null;
	}

	const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

	if (!rawValue) {
		return null;
	}

	try {
		return JSON.parse(rawValue);
	} catch {
		return null;
	}
}

function saveAuthSession({ token, user, remember }) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(
		AUTH_STORAGE_KEY,
		JSON.stringify({
			token,
			email: user.email,
			role: user.role,
			remember,
			loggedInAt: new Date().toISOString(),
			user,
		})
	);

	saveUserProfile(user);
}

export function getAuthToken() {
	return getAuthSession()?.token || null;
}

export function updateStoredAuthUser(user) {
	const session = getAuthSession();

	if (typeof window === "undefined" || !session) {
		return;
	}

	window.localStorage.setItem(
		AUTH_STORAGE_KEY,
		JSON.stringify({
			...session,
			email: user.email,
			role: user.role,
			user,
		})
	);

	saveUserProfile(user);
}

export async function signIn(email, password, remember = true) {
	const response = await login({
		email: email.trim(),
		password,
	});

	saveAuthSession({
		token: response.token,
		user: response.user,
		remember,
	});

	return response.user;
}

export async function signUp(payload) {
	const response = await register(payload);

	saveAuthSession({
		token: response.token,
		user: response.user,
		remember: true,
	});

	return response.user;
}

export async function signOut() {
	const token = getAuthToken();

	if (typeof window !== "undefined") {
		window.localStorage.removeItem(AUTH_STORAGE_KEY);
	}

	clearUserProfile();

	if (!token) {
		return;
	}

	try {
		await logout(token);
	} catch {
		// JWT logout is client-driven here, so local sign-out still succeeds.
	}
}

export async function refreshCurrentUser() {
	const session = getAuthSession();

	if (!session?.token) {
		return null;
	}

	const response = await getMe(session.token);
	updateStoredAuthUser(response.user);

	return response.user;
}

export function isAuthenticated() {
	return Boolean(getAuthSession()?.token);
}

export function getCurrentUserRole() {
	return getAuthSession()?.role || null;
}

export function isUserAuthenticated() {
	return getCurrentUserRole() === "user";
}

export function isAdminAuthenticated() {
	return getCurrentUserRole() === "admin";
}
