import React, { useEffect, useState } from "react";
import "./ProductsList.css";
import ProductCard from "./ProductCard";
import useData from "../../hooks/useData";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useSearchParams } from "react-router-dom";
import Pagination from "./../Common/Pagination";

const postsPerPage = 8;
const usePagination = false;
const useInfiniteScroll = true;

const ProductsList = () => {
  const [search, setSearch] = useSearchParams();
  const category = search.get("category");
  const page = search.get("page") || "1";
  const [pageInfinite, setPageInfinite] = useState(1);
  const { data, error, loading } = usePagination
    ? useData(
        "/products",
        {
          params: {
            category,
            page,
            perPage: postsPerPage,
          },
        },
        useInfiniteScroll,
        [category, page],
      )
    : useData(
        "/products",
        {
          params: {
            category,
            page: pageInfinite,
            perPage: postsPerPage,
          },
        },
        useInfiniteScroll,
        [category, pageInfinite],
      );
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

      if (reachedBottom && !loading && !noMoreData) {
        setPageInfinite((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, data]);

  if (useInfiniteScroll) {
    useEffect(() => {
      setPageInfinite(1);
    }, [category]);
  }
  return (
    <section className="products_list_section">
      <header className="align_center products_list_header">
        <h2>Products</h2>
        <select name="sort" id="" className="products_sorting">
          <option value="">Relevance</option>
          <option value="price desc">Price HIGH to LOW</option>
          <option value="price asc">Price LOW to HIGH</option>
          <option value="rate desc">Rate HIGH to LOW</option>
          <option value="rate asc">Rate LOW to HIGH</option>
        </select>
      </header>
      <div key="products_list" className="products_list">
        {error && <em className="form_error">{error}</em>}
        {loading
          ? Array.from({ length: postsPerPage }).map((__, index) => (
              <ProductCardSkeleton key={index}></ProductCardSkeleton>
            ))
          : data?.products.map((product) => (
              <ProductCard
                key={page * 1000 + 100 * pageInfinite + product._id}
                id={product._id}
                image={product.images[0]}
                title={product.title}
                rating={product.reviews.rate}
                ratingCounts={product.reviews.counts}
                stock={product.stock}
                price={product.price}
              ></ProductCard>
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
