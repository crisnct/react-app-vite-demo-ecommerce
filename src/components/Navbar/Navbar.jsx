import React, { use, useContext, useEffect } from "react";
import "./Navbar.css";
import LinkWithIcon from "./LinkWithIcon";

import rocket from "../../assets/rocket.png";
import star from "../../assets/glowing-star.png";
import idButton from "../../assets/id-button.png";
import memo from "../../assets/memo.png";
import order from "../../assets/package.png";
import lock from "../../assets/locked.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "./../../context/UserContext";
import CartContext from "../../context/CartContext";
import { useState } from "react";
import getSugestionsAPI from "../../services/productServices";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Navbar = () => {
  const user = useContext(UserContext);
  let cartArray = [];
  if (user) {
    //Only in react 19 and above use it can be used instead of useContext inside of if conditions
    //use is an API and not a hook, like useContext
    const { cart } = use(CartContext);
    cartArray = cart;
  }

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const searchVal = search.trim();
    if (searchVal !== "") {
      navigate(`/products?search=${searchVal}`);
    }
    setSuggestions([]);
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && selectedItem < suggestions.length - 1) {
      setSelectedItem(selectedItem + 1);
    } else if (e.key === "ArrowUp" && selectedItem > 0) {
      setSelectedItem(selectedItem - 1);
    } else if (e.key === "Enter" && selectedItem > -1) {
      const suggestion = suggestions[selectedItem];
      navigate(`/products?search=${suggestion.title}`);
      setSearch("");
      setSuggestions([]);
    } else {
      setSelectedItem(-1);
    }
  };

  useEffect(() => {
    const delayedSuggestions = setTimeout(() => {
      if (search.trim() !== "") {
        getSugestionsAPI(search)
          .then((res) => {
            setSuggestions(res.data);
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error at retrieving search sugestions from backend");
          });
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(delayedSuggestions);
  }, [search]);

  return (
    <motion.nav
      className="navbar align_center"
      initial={{ opacity: 1, y: -70 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="align_center">
        <h1 className="navbar_heading">CartWish</h1>
        <form className="navbar_form align_center" onSubmit={handleSubmit}>
          <input
            type="text"
            className="navbar_search"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          ></input>
          <button type="submit" className="search_button">
            Search
          </button>
          {suggestions.length > 0 && (
            <ul className="search_result">
              {suggestions.map((suggestion, index) => (
                <li
                  className={
                    selectedItem === index
                      ? "search_suggestion_link active"
                      : "search_suggestion_link"
                  }
                  key={suggestion._id}
                >
                  <Link
                    to={`/products?search=${suggestion.title}`}
                    onClick={() => {
                      setSearch("");
                      setSuggestions([]);
                    }}
                  >
                    {suggestion.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
      <div className="align_center navbar_links">
        <LinkWithIcon title="Home" link="/" emoji={rocket} />
        <LinkWithIcon title="Products" link="/products" emoji={star} />
        {!user && (
          <>
            <LinkWithIcon title="LogIn" link="/login" emoji={idButton} />
            <LinkWithIcon title="SignUp" link="/signup" emoji={memo} />
          </>
        )}
        {user && (
          <>
            <LinkWithIcon title="My Orders" link="myorders" emoji={order} />
            <LinkWithIcon title="LogOut" link="/logout" emoji={lock} />
            <NavLink to="/cart" className="align_center">
              Cart{" "}
              <p className="align_center cart_counts">{cartArray.length}</p>
            </NavLink>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
