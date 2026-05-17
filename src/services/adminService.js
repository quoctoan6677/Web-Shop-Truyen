import { apiRequest } from "./api";

function buildAuthHeaders(token) {
	return {
		Authorization: `Bearer ${token}`,
	};
}

export function getDashboard(token) {
	return apiRequest("/admin/dashboard", {
		headers: buildAuthHeaders(token),
	});
}

export function getAdminProducts(token, query = {}) {
	const searchParams = new URLSearchParams();

	if (query.q?.trim()) {
		searchParams.set("q", query.q.trim());
	}

	if (query.category && query.category !== "Tất cả thể loại") {
		searchParams.set("category", query.category);
	}

	if (query.status && query.status !== "Tất cả trạng thái") {
		searchParams.set("status", query.status);
	}

	const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";

	return apiRequest(`/admin/products${suffix}`, {
		headers: buildAuthHeaders(token),
	});
}

export function createAdminProduct(token, payload) {
	return apiRequest("/admin/products", {
		method: "POST",
		headers: buildAuthHeaders(token),
		body: JSON.stringify(payload),
	});
}

export function updateAdminProduct(token, productId, payload) {
	return apiRequest(`/admin/products/${productId}`, {
		method: "PUT",
		headers: buildAuthHeaders(token),
		body: JSON.stringify(payload),
	});
}

export function deleteAdminProduct(token, productId) {
	return apiRequest(`/admin/products/${productId}`, {
		method: "DELETE",
		headers: buildAuthHeaders(token),
	});
}

export function getAdminOrders(token) {
	return apiRequest("/admin/orders", {
		headers: buildAuthHeaders(token),
	});
}

export function updateAdminOrderStatus(token, orderId, status) {
	return apiRequest(`/admin/orders/${orderId}/status`, {
		method: "PUT",
		headers: buildAuthHeaders(token),
		body: JSON.stringify({ status }),
	});
}
