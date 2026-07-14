import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Home/HomePage";
import LoginPage from "../Authentication/LoginPage";
import SignupPage from "../Authentication/SignupPage";
import MyOrderPage from "./../MyOrder/MyOrderPage";
import CartPage from "./../Cart/CartPage";
import SingleProductPage from "./../SingleProduct/SingleProductPage";
import ProductsPage from "./../Products/ProductsPage";
import LogoutPage from "../Authentication/LogoutPage";
import CartContext from "../../context/CartContext";
import ProtectedRoute from "./ProtectedRoute";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage></HomePage>} />
      <Route path="/login" element={<LoginPage></LoginPage>} />
      <Route path="/products" element={<ProductsPage></ProductsPage>} />
      <Route path="/signup" element={<SignupPage></SignupPage>} />
      <Route path="/product/:id" element={<SingleProductPage />} />
      <Route element={<ProtectedRoute></ProtectedRoute>}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/myorders" element={<MyOrderPage></MyOrderPage>} />
        <Route path="/logout" element={<LogoutPage></LogoutPage>} />
      </Route>
    </Routes>
  );
};

export default Routing;
