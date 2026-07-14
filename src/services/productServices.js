import React from "react";
import apiClient from "../utils/apiClient";

function getSugestionsAPI(search) {
  return apiClient.get(`/products/suggestions?search=${search}`);
}

export default getSugestionsAPI;
