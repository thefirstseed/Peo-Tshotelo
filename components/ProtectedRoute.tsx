import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('buyer' | 'seller')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // We run the effect only when loading is finished.
    if (!isLoading) {
      if (!user) {
        // If not authenticated, redirect to login.
        navigate('/login');
      } else if (roles && !roles.includes(user.role)) {
        // If authenticated but role doesn't match, redirect to home.
        // An alert is disruptive; a silent redirect is better UX.
        navigate('/');
      }
    }
  }, [user, isLoading, roles]);

  // While checking auth status, show a loading indicator.
  if (isLoading) {
    return <div className="text-center py-10">Authenticating...</div>;
  }
  
  // If user is not logged in, they will be redirected. Show a placeholder.
  if (!user) {
    return <div className="text-center py-10">Redirecting to login...</div>;
  }

  // If user role is not authorized, they will be redirected. Show a placeholder.
  if (roles && !roles.includes(user.role)) {
    return <div className="text-center py-10">Access denied. Redirecting...</div>;
  }

  // If authenticated and authorized, render the protected content.
  return <>{children}</>;
};
