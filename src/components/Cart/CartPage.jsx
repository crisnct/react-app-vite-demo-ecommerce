import React, { memo, use, useContext, useEffect, useState } from "react";
import "./CartPage.css";
import remove from "../../assets/remove.png";
import Table from "../Common/Table";
import QuantityInput from "../SingleProduct/QuantityInput";
import { toast } from "react-toastify";
import UserContext from "../../context/UserContext";
import apiClient from "../../utils/apiClient";
import CartContext from "../../context/CartContext";
import { checkoutAPI } from "../../services/orderServices";
import config from "../../config.json";

const CartPage = () => {
  const [quantity, setQuantity] = useState(1);
  const user = use(UserContext);
  const { cart, addToCart, removeFromCart, updateCart, setCart } =
    use(CartContext);
  const checkout = () => {
    const oldCart = [...cart];
    setCart([]);
    checkoutAPI()
      .then(() => {
        toast.success = "Order placed successfully!";
      })
      .catch((err) => {
        setCart(oldCart);
        console.log(err.response);
        toast.error = "Something went wrong!";
      });
  };

  const subtotal = useMemo(() => {
    let total = 0;
    cart.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  }, [cart]);

  return (
    <section className="align_center cart_page">
      {/* User profile */}
      <div className="align_center user_info">
        <img
          src={`${config.backendURL}/profile/${user?.profilePic}`}
          alt="user profile"
        />
        <div>
          <p className="user_name">{user?.name}</p>
          <p className="user_email">{user?.email}</p>
        </div>
      </div>

      {/* Cart table */}
      <Table headings={["Item", "Price", "Quantity", "Total", "Remove"]}>
        <tbody>
          {cart.map(({ product, quantity }) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>${product.price}</td>
              <td className="align_center table_quantity_input">
                <QuantityInput
                  quantity={quantity}
                  stock={product.stock}
                  setQuantity={updateCart}
                  cartPage={true}
                  productId={product._id}
                />
              </td>
              <td>${product.price * quantity}</td>
              <td>
                <img
                  src={remove}
                  alt="remove icon"
                  className="cart_remove_icon"
                  onClick={() => removeFromCart(product._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <table className="cart_bill">
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td>${subtotal}</td>
          </tr>
          <tr>
            <td>Shipping charge</td>
            <td>$5</td>
          </tr>
          <tr className="cart_bill_final">
            <td>Subtotal</td>
            <td>${subtotal + 5}</td>
          </tr>
        </tbody>
      </table>
      <button className="search_button checkout_button" onClick={checkout}>
        Checkout
      </button>
    </section>
  );
};

export default memo(CartPage);
