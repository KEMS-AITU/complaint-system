import React, { createContext, useContext, useEffect } from 'react';
import { apiRequest } from '../api/http';
import { useLocalStorage } from '../hooks/useLocalStorage';

type AuthContextValue = {
  token: string;
  isAdmin: boolean;
  userIdentifier: string;
  setToken: (token: string) => void;
  setUserIdentifier: (value: string) => void;
  clearToken: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenValue] = useLocalStorage('complaint_token', '');
  const [isAdminValue, setIsAdminValue] = useLocalStorage('complaint_is_admin', 'false');
  const [userIdentifier, setUserIdentifierValue] = useLocalStorage(
    'complaint_user_identifier',
    ''
  );
  const isAdmin = isAdminValue === 'true';

  const setToken = (value: string) => setTokenValue(value);
  const setUserIdentifier = (value: string) => setUserIdentifierValue(value);
  const clearToken = () => {
    setTokenValue('');
    setIsAdminValue('false');
    setUserIdentifierValue('');
  };

  useEffect(() => {
    if (!token) {
      setIsAdminValue('false');
      return;
    }

    let isCurrent = true;
    const checkAdmin = async () => {
      const result = await apiRequest('admin/complaints/', { token, method: 'HEAD' });
      if (!isCurrent) return;
      setIsAdminValue(result.ok ? 'true' : 'false');
    };

    checkAdmin();

    return () => {
      isCurrent = false;
    };
  }, [token, setIsAdminValue]);

  return (
    <AuthContext.Provider value={{ token, isAdmin, userIdentifier, setToken, setUserIdentifier, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
