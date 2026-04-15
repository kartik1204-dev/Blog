import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { hasValidToken } from "../auth/token";

const PrivateRoute = () => {
  // Frontend guard: allow only when JWT exists and is not expired.
  const isAuthenticated = hasValidToken();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
