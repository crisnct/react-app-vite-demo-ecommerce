import apiClient from "../utils/apiClient";

export async function checkoutAPI() {
  return await apiClient.post(`/order/checkout`);
}

export async function orderAPI() {
  return await apiClient.get(`/order`);
}
