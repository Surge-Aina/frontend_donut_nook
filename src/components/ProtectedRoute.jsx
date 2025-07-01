// Guards routes by role: implement actual auth logic
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireRole }) => {
  const userRole = 'customer'; // TODO: replace with real auth state

  if (requireRole && userRole !== requireRole) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;

// interns: hook this into App.js routes for /admin and /manager
