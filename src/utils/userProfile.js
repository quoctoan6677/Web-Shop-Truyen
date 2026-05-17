const STORAGE_KEY = "shop-truyen-user-profile";

export const defaultUserProfile = {
	fullName: "",
	email: "",
	phone: "",
	address: "",
};

export function getStoredUserProfile() {
	if (typeof window === "undefined") {
		return defaultUserProfile;
	}

	const rawValue = window.localStorage.getItem(STORAGE_KEY);

	if (!rawValue) {
		return defaultUserProfile;
	}

	try {
		return {
			...defaultUserProfile,
			...JSON.parse(rawValue),
		};
	} catch {
		return defaultUserProfile;
	}
}

export function saveUserProfile(profile) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
	window.dispatchEvent(new Event("user-profile-updated"));
}

export function clearUserProfile() {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(STORAGE_KEY);
	window.dispatchEvent(new Event("user-profile-updated"));
}
