import React from "react";
import "./FeatureProduct.css";
import ProductCard from "../Products/ProductCard";
import useData from "../../hooks/useData";
import ProductCardSkeleton from "./../Products/ProductCardSkeleton";
import { motion } from "framer-motion";

const FeatureProduct = () => {
  const { data, error, isLoading } = useData(
    "/products/featured",
    null,
    ["products", "featured"],
    10 * 60 * 60 * 1000,
    true,
  );
  return (
    <section className="feature_products">
      <motion.h2
        className="feature_products_heading"
        initial={{ opacity: 1, y: -70 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0 }}
      >
        Future Products
      </motion.h2>
      <div className="align_center feature_products_list">
        {error && <em className="form_error">{error.message}</em>}
        {isLoading
          ? Array.from({ length: 3 }).map((__, index) => (
              <ProductCardSkeleton key={index}></ProductCardSkeleton>
            ))
          : data?.map((product, index) => (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <ProductCard key={product._id} product={product} />
              </motion.div>
            ))}
      </div>
    </section>
  );
};

export default FeatureProduct;
