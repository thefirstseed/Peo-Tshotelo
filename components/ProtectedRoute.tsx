import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: ('buyer' | 'seller')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center py-10">Authenticating...</div>;
  }
  
  if (!user) {
    // Redirect to login page if not authenticated
    navigate('/login');
    return null; // Render nothing while redirecting
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to home if user role is not authorized
    alert("You don't have permission to access this page.");
    navigate('/');
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};