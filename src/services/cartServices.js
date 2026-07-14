import apiClient from "../utils/apiClient";

export async function addToCartAPI(id, quantity) {
  return await apiClient.post(`/cart/${id}`, { quantity });
}

export async function getCartAPI() {
  return await apiClient.get(`/cart`);
}

export async function removeFromCartAPI(id) {
  return await apiClient.patch(`/cart/remove/${id}`);
}

export async function increaseProductAPI(id) {
  return await apiClient.patch(`/cart/increase/${id}`);
}

export async function decreaseProductAPI(id) {
  return await apiClient.patch(`/cart/decrease/${id}`);
}
