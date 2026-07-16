import React, { useEffect, useState } from "react";
import ApiClient from "../utils/apiClient";
import { useQuery } from "@tanstack/react-query";

const useData = (
  endpoint,
  customConfig = {},
  queryKey,
  staleTime = 300_000,
) => {
  const fetchFunction = () =>
    ApiClient.get(endpoint, customConfig).then((resp) => resp.data);

  return useQuery({
    queryKey: queryKey,
    queryFn: fetchFunction,
    retry: 7,
    retryDelay: 3000,
    staleTime: staleTime, //how much time data live in cache
    refetchOnReconnect: true, //refetch stale data when the internet connection is up again
    refetchOnWindowFocus: false, //refetch stale data when the user switch back to browser tab of the app
    refetchInterval: 60_000, // fetch automatically data every 60 sec
  });
};

export default useData;
