const STORAGE_KEY = "shop-truyen-user-profile";

export const defaultUserProfile = {
	fullName: "Phạm Quốc Toản",
	email: "toanpham@example.com",
	phone: "0328 322 623",
	address: "Bắc Từ Liêm, Hà Nội",
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
}
