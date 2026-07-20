import React, { memo, useContext, useState } from "react";
import "./SingleProductPage.css";
import QuantityInput from "./QuantityInput";
import { useParams } from "react-router-dom";
import useData from "./../../hooks/useData";
import ApiClient from "../../utils/apiClient";
import Loader from "../Common/Loader";
import CartContext from "../../context/CartContext";
import UserContext from "../../context/UserContext";

const SingleProductPage = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useData(
    "/products/" + id,
    null,
    ["products", id],
    7000,
    true,
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const user = useContext(UserContext);

  return (
    <>
      {isLoading && <Loader></Loader>}
      {error && <em className="form_error">{error.message}</em>}
      {!error && (
        <section className="align_center single_product">
          <div className="align_center">
            <title>{"CartWish-" + data?.title}</title>
            <meta name="description" content={data?.description} />
            <div className="single_product_thumbnails">
              {data?.images.map((image, index) => (
                <img
                  src={`${ApiClient.defaults.imagesURL}/${image}`}
                  key={index}
                  alt="product.title"
                  onClick={() => setSelectedImage(index)}
                  className={selectedImage === index ? "selected_image" : ""}
                />
              ))}
            </div>
            <img
              src={`${ApiClient.defaults.imagesURL}/${data?.images[selectedImage]}`}
              key={selectedImage}
              alt="product.title"
              className="single_product_display"
            />
          </div>
          <div className="single_product_details">
            <h1 className="single_product_title">{data?.title}</h1>
            <p className="single_product_description">{data?.description}</p>
            <p className="single_product_price">${data?.price.toFixed(2)}</p>
            {user && (
              <>
                <h2 className="quantity_title">Quantity:</h2>
                <div className="align_center quantity_input">
                  <QuantityInput
                    quantity={quantity}
                    stock={data?.stock}
                    setQuantity={setQuantity}
                  />
                </div>

                <button
                  className="search_button add_cart"
                  onClick={() => addToCart(data, quantity)}
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default memo(SingleProductPage);
