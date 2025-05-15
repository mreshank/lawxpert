import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();

  const location = useLocation();

  console.log("user : ", user);
  console.log("isAdmin : ", isAdmin);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && user?.user.role !== 'admin') {
    // return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // if (!user) {
  //   // Save the attempted URL for redirecting after login
  //   return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute; 
