import { toast } from "react-toastify";
import apiClient from "../../utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }) =>
      apiClient.post(`/cart/${id}`, { quantity }).then((res) => res.data),

    onMutate: async ({ id, quantity, product }) => {
      await queryClient.cancelQueries(["cart"]);
      const prevCart = queryClient.getQueryData(["cart"]);
      const updatedCart = [...prevCart];
      const productIndex = updatedCart.findIndex(
        (item) => item.product._id === id,
      );

      if (productIndex === -1) {
        updatedCart.push({ product, quantity });
      } else {
        updatedCart[productIndex].quantity += quantity;
      }

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

export default useAddToCart;
