import React, { createContext, useContext, useEffect } from 'react';
import { apiRequest } from '../api/http';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getProfile } from '../../features/account/accountApi';

type AuthContextValue = {
  token: string;
  isAdmin: boolean;
  userIdentifier: string;
  userName: string;
  userEmail: string;
  userId: string;
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
  const [userName, setUserName] = useLocalStorage('complaint_user_name', '');
  const [userEmail, setUserEmail] = useLocalStorage('complaint_user_email', '');
  const [userId, setUserId] = useLocalStorage('complaint_user_id', '');
  const isAdmin = isAdminValue === 'true';

  const setToken = (value: string) => setTokenValue(value);
  const setUserIdentifier = (value: string) => setUserIdentifierValue(value);
  const clearToken = () => {
    setTokenValue('');
    setIsAdminValue('false');
    setUserIdentifierValue('');
    setUserName('');
    setUserEmail('');
    setUserId('');
  };

  useEffect(() => {
    if (!token) {
      setIsAdminValue('false');
      setUserName('');
      setUserEmail('');
      setUserId('');
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

  useEffect(() => {
    if (!token) return;
    let active = true;
    const loadProfile = async () => {
      const result = await getProfile(token);
      if (!active) return;
      if (!result.ok || !result.data) return;
      const name = `${result.data.first_name ?? ''} ${result.data.last_name ?? ''}`.trim();
      setUserName(name || result.data.username || '');
      setUserEmail(result.data.email || '');
      setUserId(result.data.id ? String(result.data.id) : '');
    };
    loadProfile();
    return () => {
      active = false;
    };
  }, [token, setUserName, setUserEmail, setUserId]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAdmin,
        userIdentifier,
        userName,
        userEmail,
        userId,
        setToken,
        setUserIdentifier,
        clearToken,
      }}
    >
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
