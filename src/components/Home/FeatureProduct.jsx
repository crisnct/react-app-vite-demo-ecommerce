import React from "react";
import "./FeatureProduct.css";
import ProductCard from "../Products/ProductCard";

const FeatureProduct = () => {
  return (
    <section className="feature_products">
      <h2 className="feature_products_heading">Future Products</h2>
      <div className="align_center feature_products_list">
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
        <ProductCard></ProductCard>
      </div>
    </section>
  );
};

export default FeatureProduct;
