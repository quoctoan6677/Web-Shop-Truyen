import { apiRequest } from "./api";

export function getProducts() {
	return apiRequest("/products");
}

export function getProductById(productId) {
	return apiRequest(`/products/${productId}`);
}
