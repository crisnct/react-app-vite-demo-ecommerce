import { toast } from "react-toastify";
import apiClient from "../../utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) =>
      apiClient.patch(`/cart/remove/${id}`).then((res) => res.data),

    onMutate: async ({ id, quantity, product }) => {
      await queryClient.cancelQueries(["cart"]);
      const prevCart = queryClient.getQueryData(["cart"]);
      const newCart = prevCart.filter((item) => item.product._id !== id);
      queryClient.setQueryData(["cart"], newCart);
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

export default useRemoveFromCart;
