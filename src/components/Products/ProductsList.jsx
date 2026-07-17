import React, { useEffect, useState } from "react";
import "./ProductsList.css";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useSearchParams } from "react-router-dom";
import Pagination from "./../Common/Pagination";
import useProductList from "./../../hooks/useProductList";

const postsPerPage = 8;
const usePagination = false;
const useInfiniteScroll = true;

const ProductsList = () => {
  const [search, setSearch] = useSearchParams();
  const category = search.get("category");
  const searchQuery = search.get("search");
  const [sortBy, setSortBy] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);
  const { data, error, fetchNextPage, isFetching, hasNextPage } =
    useProductList({
      search: searchQuery,
      category,
      perPage: postsPerPage,
    });
  const handlePageChangePagination = (selectedPage) => {
    const currentParams = Object.fromEntries([...search]);
    setSearch({ ...currentParams, page: String(selectedPage) });
  };

  useEffect(() => {
    if (!useInfiniteScroll) return undefined;
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      const reachedBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const noMoreData =
        data?.products?.length && data?.totalProducts
          ? data.products.length >= data.totalProducts
          : false;

      if (reachedBottom && !isFetching && hasNextPage) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchQuery, isFetching, data]);

  useEffect(() => {
    if (data && data.pages) {
      const products = data.pages.flatMap((page) => page.products);
      if (sortBy === "price desc") {
        setSortedProducts(products.sort((a, b) => b.price - a.price));
      } else if (sortBy === "price asc") {
        setSortedProducts(products.sort((a, b) => a.price - b.price));
      } else if (sortBy === "rate desc") {
        setSortedProducts(
          products.sort((a, b) => b.reviews.rate - a.reviews.rate),
        );
      } else if (sortBy === "rate asc") {
        setSortedProducts(
          products.sort((a, b) => a.reviews.rate - b.reviews.rate),
        );
      } else {
        setSortedProducts(products);
      }
    }
  }, [sortBy, data]);

  return (
    <section className="products_list_section">
      <header className="align_center products_list_header">
        <h2>Products</h2>
        <select
          name="sort"
          id=""
          className="products_sorting"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Relevance</option>
          <option value="price desc">Price HIGH to LOW</option>
          <option value="price asc">Price LOW to HIGH</option>
          <option value="rate desc">Rate HIGH to LOW</option>
          <option value="rate asc">Rate LOW to HIGH</option>
        </select>
      </header>
      <div key="products_list" className="products_list">
        {error && <em className="form_error">{error.message}</em>}
        {isFetching
          ? Array.from({ length: postsPerPage }).map((__, index) => (
              <ProductCardSkeleton key={index}></ProductCardSkeleton>
            ))
          : sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product}></ProductCard>
            ))}

        {data && usePagination && (
          <Pagination
            totalPosts={data.totalProducts}
            postsPerPage={postsPerPage}
            currentPage={page}
            onClick={handlePageChangePagination}
          />
        )}
      </div>
    </section>
  );
};

export default ProductsList;
