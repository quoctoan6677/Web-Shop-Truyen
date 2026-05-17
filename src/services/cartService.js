import { apiRequest } from "./api";

export function getCart(token) {
	return apiRequest("/cart", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export function addToCart(token, payload) {
	return apiRequest("/cart", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});
}

export function updateCartItem(token, cartItemId, payload) {
	return apiRequest(`/cart/${cartItemId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});
}

export function deleteCartItem(token, cartItemId) {
	return apiRequest(`/cart/${cartItemId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}
