// ════════════════════════════════════════════════════════════════════════════════
// shared/lib/api-client.ts
// Generic API client for all features
// Pure fetch wrapper with error handling — NO React, NO hooks
// ════════════════════════════════════════════════════════════════════════════════

const getBase = (): string =>
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  'http://localhost:8000';

interface ApiOptions {
  token?: string | null;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const message =
      typeof body?.detail === 'string'
        ? body.detail
        : Array.isArray(body?.detail)
        ? body.detail.map((e: { msg: string }) => e.msg).join(', ')
        : `HTTP ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, method = 'GET', body } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${getBase()}${endpoint}`;
  const res = await fetch(url, config);
  return handleResponse<T>(res);
}

// Convenience methods
apiClient.get = <T>(endpoint: string, token?: string | null) =>
  apiClient<T>(endpoint, { method: 'GET', token });

apiClient.post = <T>(endpoint: string, body: unknown, token?: string | null) =>
  apiClient<T>(endpoint, { method: 'POST', body, token });

apiClient.put = <T>(endpoint: string, body: unknown, token?: string | null) =>
  apiClient<T>(endpoint, { method: 'PUT', body, token });

apiClient.delete = <T>(endpoint: string, token?: string | null) =>
  apiClient<T>(endpoint, { method: 'DELETE', token });

apiClient.patch = <T>(endpoint: string, body: unknown, token?: string | null) =>
  apiClient<T>(endpoint, { method: 'PATCH', body, token });
