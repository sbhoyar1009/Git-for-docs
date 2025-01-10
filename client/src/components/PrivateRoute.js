import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if the user is logged in (e.g., by checking for a token in localStorage)
  const isAuthenticated = !!localStorage.getItem("token");

  // If not authenticated, redirect to login page
  return isAuthenticated ? children :" Go back";
};

export default PrivateRoute;
