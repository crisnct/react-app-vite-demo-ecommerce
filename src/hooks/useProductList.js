import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";

const useProductList = (query) => {
  const fetchFunction = ({ pageParam = 1 }) =>
    apiClient
      .get("/products", {
        params: {
          ...query,
          page: pageParam,
        },
      })
      .then((resp) => resp.data);

  return useInfiniteQuery({
    queryKey: ["products", query],
    queryFn: fetchFunction,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : null;
    },
    retry: 7,
    retryDelay: 3000,
    staleTime: 60 * 60 * 1000, //how much time data live in cache
    refetchOnReconnect: true, //refetch stale data when the internet connection is up again
    refetchOnWindowFocus: false, //refetch stale data when the user switch back to browser tab of the app
    refetchInterval: 60_000, // fetch automatically data every 60 sec
  });
};

export default useProductList;
