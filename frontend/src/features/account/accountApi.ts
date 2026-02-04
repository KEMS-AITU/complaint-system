import { apiRequest } from '../../shared/api/http';

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'CLIENT' | 'ADMIN';
  is_superuser: boolean;
  is_staff: boolean;
  avatar: string | null;
  avatar_url: string;
  date_joined: string;
  last_login: string | null;
};

export type UserProfileUpdate = {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

export const getProfile = (token: string) => {
  return apiRequest<UserProfile>('auth/me/', { token });
};

export const updateProfile = (token: string, payload: UserProfileUpdate) => {
  return apiRequest<UserProfile>('auth/me/', {
    token,
    method: 'PATCH',
    body: payload,
  });
};

export const updateAvatar = (token: string, file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return apiRequest<UserProfile>('auth/me/', {
    token,
    method: 'PATCH',
    body: formData,
  });
};
