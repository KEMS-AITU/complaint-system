import { apiRequest } from '../../shared/api/http';

type LoginPayload = {
  username: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

export const login = (payload: LoginPayload) => {
  return apiRequest<{ token: string }>('auth/login/', {
    method: 'POST',
    body: payload,
  });
};

export const register = (payload: RegisterPayload) => {
  return apiRequest('auth/register/', {
    method: 'POST',
    body: payload,
  });
};

export const requestPasswordReset = (email: string) => {
  // TODO: Replace with the real endpoint when backend support is available.
  return apiRequest('auth/password/reset/', {
    method: 'POST',
    body: { email },
  });
};

export const resetPassword = (token: string, password: string) => {
  // TODO: Replace with the real endpoint when backend support is available.
  return apiRequest('auth/password/reset/confirm/', {
    method: 'POST',
    body: { token, password },
  });
};
