// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from './CookieManager';

const ProtectedRoute = ({ children, requireRole }) => {
  const token = getCookie('token');
  const role = getCookie('role');

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (requireRole && role !== requireRole) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
