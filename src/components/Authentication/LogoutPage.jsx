import React, { useEffect } from "react";
import "./LogoutPage.css";
import { logout } from "../../services/userServices";

const LogoutPage = () => {
  useEffect(() => {
    logout();
    window.location = "/";
  }, []);
  return null;
};

export default LogoutPage;
