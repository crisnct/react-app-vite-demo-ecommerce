import React, { useEffect, useState } from "react";
import ApiClient from "../utils/apiClient";

const useData = (endpoint, customConfig, persistData, dependencies) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.get(endpoint, customConfig);
      const effectivePage = Number(
        customConfig?.params?.page ?? customConfig?.params?.pageInfinite ?? 1,
      );
      const willAppend =
        persistData &&
        data !== null &&
        endpoint === "/products" &&
        response &&
        response.data &&
        response.data.products &&
        effectivePage > 1;
      if (willAppend) {
        setData((prev) => ({
          ...prev,
          products: [...prev.products, ...response.data.products],
        }));
      } else {
        setData(response.data);
      }
    } catch (error) {
      console.log("Error at retrieving data from server " + error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(
    () => {
      loadData();
    },
    dependencies ? dependencies : [],
  );
  return { data, error, loading };
};

export default useData;
