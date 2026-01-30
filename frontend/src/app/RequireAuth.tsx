import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/auth/AuthContext';

type RequireAuthProps = {
  children: ReactNode;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
