import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

