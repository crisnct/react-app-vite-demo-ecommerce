import apiClient from "./apiClient";

const setAuthToken = (token) => {
  if (token) {
    console.log("Set auth token from local storage");
    apiClient.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete apiClient.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
