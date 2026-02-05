import { apiRequest } from './http';
import type { Complaint } from '../types';

export type ComplaintListParams = {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
};

type ComplaintListResponse =
  | Complaint[]
  | {
      results: Complaint[];
      next?: string | null;
      count?: number;
    };

const buildQuery = (params: ComplaintListParams) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.category) query.set('category', params.category);
  if (params.page) query.set('page', String(params.page));
  const value = query.toString();
  return value ? `?${value}` : '';
};

export const createComplaint = (payload: { text: string; category?: number }, token: string) => {
  return apiRequest<Complaint>('complaints/', {
    method: 'POST',
    body: payload,
    token,
  });
};

export const listComplaints = (params: ComplaintListParams, token: string) => {
  return apiRequest<ComplaintListResponse>(`complaints/${buildQuery(params)}`, {
    method: 'GET',
    token,
  });
};

export const getComplaint = (id: number | string, token: string) => {
  return apiRequest<Complaint>(`complaints/${id}/`, {
    method: 'GET',
    token,
  });
};
