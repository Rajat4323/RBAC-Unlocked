import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, ...rest }) => {
  const role = localStorage.getItem("role"); // Assume role is stored after login

  return role ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
