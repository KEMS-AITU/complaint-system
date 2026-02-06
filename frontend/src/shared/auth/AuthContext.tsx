import React, { createContext, useContext, useEffect } from 'react';
import { apiRequest } from '../api/http';
import { API_BASE_URL } from '../api/config';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getProfile } from '../../features/account/accountApi';

type AuthContextValue = {
  token: string;
  isAdmin: boolean;
  userIdentifier: string;
  userName: string;
  userEmail: string;
  userId: string;
  userAvatarUrl: string;
  setToken: (token: string) => void;
  setUserIdentifier: (value: string) => void;
  setUserProfile: (profile: {
    name?: string;
    email?: string;
    id?: string;
    avatarUrl?: string;
  }) => void;
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
  const [userAvatarUrl, setUserAvatarUrl] = useLocalStorage('complaint_user_avatar', '');
  const isAdmin = isAdminValue === 'true';

  const buildMediaUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const setToken = (value: string) => setTokenValue(value);
  const setUserIdentifier = (value: string) => setUserIdentifierValue(value);
  const setUserProfile = (profile: {
    name?: string;
    email?: string;
    id?: string;
    avatarUrl?: string;
  }) => {
    if (profile.name !== undefined) setUserName(profile.name);
    if (profile.email !== undefined) setUserEmail(profile.email);
    if (profile.id !== undefined) setUserId(profile.id);
    if (profile.avatarUrl !== undefined) setUserAvatarUrl(profile.avatarUrl);
  };
  const clearToken = () => {
    setTokenValue('');
    setIsAdminValue('false');
    setUserIdentifierValue('');
    setUserName('');
    setUserEmail('');
    setUserId('');
    setUserAvatarUrl('');
  };

  useEffect(() => {
    if (!token) {
      setIsAdminValue('false');
      setUserName('');
      setUserEmail('');
      setUserId('');
      setUserAvatarUrl('');
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
      setUserAvatarUrl(buildMediaUrl(result.data.avatar_url || result.data.avatar || ''));
    };
    loadProfile();
    return () => {
      active = false;
    };
  }, [token, setUserName, setUserEmail, setUserId, setUserAvatarUrl]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAdmin,
        userIdentifier,
        userName,
        userEmail,
        userId,
        userAvatarUrl,
        setToken,
        setUserIdentifier,
        setUserProfile,
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
