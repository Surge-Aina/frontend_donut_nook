// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from './CookieManager';

const ProtectedRoute = ({ children, requireRole }) => {
  const token = getCookie('token');
  const role = getCookie('role');

  if (!token) {
    // User not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requireRole) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowedRoles.includes(role)) {
      // User logged in but not authorized
      return <Navigate to="/login" replace />;
    }
  }

  // User authorized, render the children components
  return children;
};

export default ProtectedRoute;



