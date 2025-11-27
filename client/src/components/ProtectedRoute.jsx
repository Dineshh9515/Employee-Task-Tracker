import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is a regular user and has no linked employee profile (e.g. OAuth)
  if (user.role === 'user' && !user.linkedEmployee) {
    if (location.pathname === '/complete-profile') {
      return <Outlet />;
    }
    return <Navigate to="/complete-profile" replace />;
  }

  // If user is not approved
  if (user.isApproved === false) {
    // Allow access to pending-approval
    if (location.pathname === '/pending-approval') {
      return <Outlet />;
    }
    // Redirect all other requests to pending-approval
    return <Navigate to="/pending-approval" replace />;
  }

  // If user IS approved, prevent access to pending pages
  if (location.pathname === '/pending-approval' || location.pathname === '/complete-profile') {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if authorized but wrong role, or login
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
