import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Routing from "./components/Routing/Routing";
import { jwtDecode } from "jwt-decode";
import { getToken, getUser, logout } from "./services/userServices";
import setAuthToken from "./utils/setAuthToken";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import UserContext from "./context/UserContext";
import CartContext from "./context/CartContext";
import { useCallback } from "react";
import useData from "./hooks/useData";
import useAddToCart from "./hooks/cart/useAddToCart";
import { useQueryClient } from "@tanstack/react-query";
import useRemoveFromCart from "./hooks/cart/useRemoveFromCart";
import useQuantityModifier from "./hooks/cart/useQuantityModifier";

setAuthToken(getToken());

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const { data: cartData } = useData("/cart", null, ["cart"], 10_000, !!user);
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const increaseQuantityMutation = useQuantityModifier("INCREASE");
  const decreaseQuantityMutation = useQuantityModifier("DECREASE");

  useEffect(() => {
    if (cartData) {
      setCart(cartData);
    }
  }, [cartData]);

  useEffect(() => {
    try {
      const decodedJwt = getUser();
      if (decodedJwt && Date.now() >= decodedJwt.exp * 1000) {
        logout();
        location.reload();
      } else {
        setUser(decodedJwt);
      }
    } catch (err) {}
  }, []);

  const addToCart = useCallback(
    (product, quantity) => {
      addToCartMutation.mutate({ id: product._id, quantity, product });
    },
    [addToCartMutation],
  );

  const removeFromCart = useCallback(
    (id) => {
      removeFromCartMutation.mutate({ id });
    },
    [removeFromCartMutation],
  );

  const updateCart = (type, id) => {
    if (type === "increase") {
      increaseQuantityMutation.mutate({ id });
    } else if (type === "decrease") {
      decreaseQuantityMutation.mutate({ id });
    } else {
      console.log("Wrong argument for type: ", type);
      return;
    }
  };

  return (
    <UserContext.Provider value={user}>
      <CartContext.Provider
        value={{ cart, addToCart, removeFromCart, updateCart, setCart }}
      >
        <div>
          <Navbar />
          <main>
            <ToastContainer position="top-right" />
            <Routing />
          </main>
        </div>
      </CartContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
