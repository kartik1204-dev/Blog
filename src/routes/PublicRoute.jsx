import React from "react";
import { Navigate } from "react-router-dom";
import { hasValidToken } from "../auth/token";

const PublicRoute = ({ children }) => {
  // If JWT is valid, keep authenticated users on home page.
  const isAuthenticated = hasValidToken();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
