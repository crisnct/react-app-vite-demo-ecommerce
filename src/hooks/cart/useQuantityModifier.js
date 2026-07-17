import { toast } from "react-toastify";
import apiClient from "../../utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useQuantityModifier = (type) => {
  const queryClient = useQueryClient();
  const apiName =
    type === "INCREASE" ? "increase" : type === "DECREASE" ? "decrease" : null;
  if (!apiName) {
    throw new Error(`Unknown type: ${type}`);
  }
  const delta = type === "INCREASE" ? 1 : -1;

  return useMutation({
    mutationFn: ({ id }) =>
      apiClient.patch(`/cart/${apiName}/${id}`).then((res) => res.data),

    onMutate: async ({ id, quantity, product }) => {
      await queryClient.cancelQueries(["cart"]);
      const prevCart = [...queryClient.getQueryData(["cart"])];
      const updatedCart = [...prevCart];
      const productIndex = updatedCart.findIndex(
        (item) => item.product._id === id,
      );
      updatedCart[productIndex].quantity += delta;
      queryClient.setQueryData(["cart"], updatedCart);
      return { prevCart };
    },

    onError: (err, variables, context) => {
      console.log(err);
      toast.error("Something went wrong");
      if (context?.prevCart) {
        queryClient.setQueryData(["cart"], context.prevCart);
      }
    },

    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
  });
};

export default useQuantityModifier;
