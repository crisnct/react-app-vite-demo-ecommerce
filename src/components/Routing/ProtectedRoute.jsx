import React from "react";
import { getUser } from "../../services/userServices";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  return getUser() ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to="/login" state={{ from: useLocation().pathname }}></Navigate>
  );
};

export default ProtectedRoute;
