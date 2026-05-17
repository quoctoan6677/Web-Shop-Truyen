import { apiRequest } from "./api";

export function createOrder(token, payload) {
	return apiRequest("/orders", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});
}

export function getMyOrders(token) {
	return apiRequest("/orders/my-orders", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function cancelOrder(token, orderId) {
	return apiRequest(`/orders/${orderId}/cancel`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}
