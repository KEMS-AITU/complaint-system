import { API_BASE_URL } from './config';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD';
  body?: unknown;
  token?: string;
};

export type ApiResult<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

const buildUrl = (path: string) => {
  const base = API_BASE_URL.replace(/\/$/, '');
  const cleaned = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/${cleaned}`;
};

const parsePayload = async (res: Response) => {
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    return await res.text();
  } catch {
    return null;
  }
};

const formatError = (payload: unknown, fallback: string) => {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (typeof payload === 'object' && 'detail' in (payload as Record<string, unknown>)) {
    const detail = (payload as Record<string, unknown>).detail;
    if (typeof detail === 'string') return detail;
  }
  try {
    return JSON.stringify(payload);
  } catch {
    return fallback;
  }
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}) => {
  const url = buildUrl(path);
  const headers: HeadersInit = {};

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) {
    headers['Authorization'] = `Token ${options.token}`;
  }

  try {
    const res = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    const payload = await parsePayload(res);

    if (res.ok) {
      return { ok: true, status: res.status, data: payload as T } satisfies ApiResult<T>;
    }

    return {
      ok: false,
      status: res.status,
      error: formatError(payload, res.statusText),
    } satisfies ApiResult<T>;
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error',
    } satisfies ApiResult<T>;
  }
};
