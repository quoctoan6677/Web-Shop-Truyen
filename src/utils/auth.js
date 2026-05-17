import { getStoredUserProfile } from "./userProfile";
import { adminMockAccount, userMockPassword } from "../data/auth";

const AUTH_STORAGE_KEY = "shop-truyen-auth-session";

export function getLoginCredentials() {
	const profile = getStoredUserProfile();

	return {
		user: {
			email: profile.email,
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

export function signIn(email, password, remember = true) {
	const credentials = getLoginCredentials();
	const normalizedEmail = email.trim();

	let matchedAccount = null;

	if (
		normalizedEmail === credentials.user.email &&
		password === credentials.user.password
	) {
		matchedAccount = credentials.user;
	}

	if (
		normalizedEmail === credentials.admin.email &&
		password === credentials.admin.password
	) {
		matchedAccount = credentials.admin;
	}

	if (!matchedAccount) {
		return null;
	}

	if (typeof window !== "undefined") {
		window.localStorage.setItem(
			AUTH_STORAGE_KEY,
			JSON.stringify({
				email: matchedAccount.email,
				role: matchedAccount.role,
				remember,
				loggedInAt: new Date().toISOString(),
			})
		);
	}

	return matchedAccount;
}

export function signOut() {
	if (typeof window !== "undefined") {
		window.localStorage.removeItem(AUTH_STORAGE_KEY);
	}
}

export function isAuthenticated() {
	return Boolean(getAuthSession());
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
