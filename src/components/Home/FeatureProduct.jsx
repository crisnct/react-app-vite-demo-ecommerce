import React from "react";
import "./FeatureProduct.css";
import ProductCard from "../Products/ProductCard";
import useData from "../../hooks/useData";
import ProductCardSkeleton from "./../Products/ProductCardSkeleton";

const FeatureProduct = () => {
  const { data, error, isLoading } = useData(
    "/products/featured",
    null,
    ["products", "featured"],
    10 * 60 * 60 * 1000,
  );
  return (
    <section className="feature_products">
      <h2 className="feature_products_heading">Future Products</h2>
      <div className="align_center feature_products_list">
        {error && <em className="form_error">{error.message}</em>}
        {isLoading
          ? Array.from({ length: 3 }).map((__, index) => (
              <ProductCardSkeleton key={index}></ProductCardSkeleton>
            ))
          : data?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </section>
  );
};

export default FeatureProduct;
