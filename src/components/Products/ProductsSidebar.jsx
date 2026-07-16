import React, { useEffect, useState } from "react";
import "./ProductsSidebar.css";
import LinkWithIcon from "../Navbar/LinkWithIcon";
import ApiClient from "../../utils/apiClient";
import useData from "../../hooks/useData";
import Loader from "../Common/Loader";

const ProductsSidebar = () => {
  const {
    data: categories,
    error,
    isLoading,
  } = useData("/category", null, ["category"], 10 * 60 * 60 * 1000);
  return (
    <aside className="products_sidebar">
      <h2>Category</h2>
      <div className="category_links">
        {isLoading && <Loader></Loader>}
        {error && <em className="form_error">{error.message}</em>}
        {categories &&
          categories.map((category) => (
            <LinkWithIcon
              id={category._id}
              key={category._id}
              title={category.name}
              link={`/products?category=${encodeURIComponent(category.name)}`}
              emoji={`${ApiClient.defaults.categoryImageURL}/${category.image}`}
              sidebar={true}
            />
          ))}
      </div>
    </aside>
  );
};

export default ProductsSidebar;
