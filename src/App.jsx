import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Routing from "./components/Routing/Routing";
import { jwtDecode } from "jwt-decode";
import { getToken, getUser, logout } from "./services/userServices";
import setAuthToken from "./utils/setAuthToken";
import {
  addToCartAPI,
  decreaseProductAPI,
  getCartAPI,
  increaseProductAPI,
  removeFromCartAPI,
} from "./services/cartServices";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import UserContext from "./context/UserContext";
import CartContext from "./context/CartContext";

setAuthToken(getToken());

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
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

  const addToCart = (product, quantity) => {
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex(
      (item) => item.product._id === product._id,
    );
    if (productIndex === -1) {
      updatedCart.push({ product, quantity });
    } else {
      updatedCart[productIndex].quantity += quantity;
    }
    setCart(updatedCart);
    addToCartAPI(product._id, quantity)
      .then((res) => {
        toast.success("Product added successfully !");
      })
      .catch((err) => {
        console.log(err.response);
        toast.error("Fail to add product!");
        setCart(cart);
      });
  };

  const getCart = () => {
    getCartAPI()
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        toast.error("Fail to get cart product!");
      });
  };

  useEffect(() => {
    if (user) {
      getCart();
    }
  }, [user]);

  const removeFromCart = (id) => {
    const oldCart = [...cart];
    const newCart = oldCart.filter((item) => item.product._id !== id);
    setCart(newCart);
    removeFromCartAPI(id).catch((err) => {
      console.log(err.response);
      toast.error("Fail to remove product from cart ");
      setCart(oldCart);
    });
  };

  const updateCart = (type, id) => {
    const oldCart = [...cart];
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex(
      (item) => item.product._id === id,
    );
    if (type === "increase") {
      updatedCart[productIndex].quantity++;
      increaseProductAPI(id).catch((err) => {
        console.log(err.response);
        toast.error("Fail to increase product quantity from cart ");
        setCart(oldCart);
      });
    } else if (type === "decrease") {
      updatedCart[productIndex].quantity--;
      decreaseProductAPI(id).catch((err) => {
        console.log(err.response);
        toast.error("Fail to decrease product quantity from cart ");
        setCart(oldCart);
      });
    } else {
      console.log("Wrong argument for type: ", type);
      return;
    }
    setCart(updatedCart);
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
