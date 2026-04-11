// core/api/client.ts
// Base API client using fetch
// System-level HTTP client with error handling

import type { ApiRequestOptions, ApiResponseHandler } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(options: ApiRequestOptions): Promise<T> {
    const { endpoint, method = 'GET', body, headers = {} } = options;
    
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'endpoint' | 'method'>): Promise<T> {
    return this.request<T>({ endpoint, method: 'GET', ...options });
  }

  post<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'endpoint' | 'method'>): Promise<T> {
    return this.request<T>({ endpoint, method: 'POST', body, ...options });
  }

  put<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'endpoint' | 'method'>): Promise<T> {
    return this.request<T>({ endpoint, method: 'PUT', body, ...options });
  }

  delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'endpoint' | 'method'>): Promise<T> {
    return this.request<T>({ endpoint, method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient(BASE_URL);
