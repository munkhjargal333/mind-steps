/**
 * Admin Feature API Client
 * Uses base ApiClient from core/api
 */

import { apiClient } from '@/core/api/client';
import type { AdminUser, LlmConfig, AdminStats } from '@/shared/types';

const BASE_PATH = '';

function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function adminListUsers(token: string): Promise<AdminUser[]> {
  return apiClient.get<AdminUser[]>(`${BASE_PATH}/api/admin/users`, {
    headers: getAuthHeaders(token),
  });
}

export async function adminInviteUser(
  token: string,
  email: string
): Promise<unknown> {
  return apiClient.post<unknown>(`${BASE_PATH}/api/admin/users/invite`, { email }, {
    headers: getAuthHeaders(token),
  });
}

export async function adminDeleteUser(token: string, userId: string): Promise<void> {
  return apiClient.delete<void>(`${BASE_PATH}/api/admin/users/${userId}`, {
    headers: getAuthHeaders(token),
  });
}

// ─── LLM Config ───────────────────────────────────────────────────────────────

export async function adminGetLlmConfig(token: string): Promise<LlmConfig> {
  return apiClient.get<LlmConfig>(`${BASE_PATH}/api/admin/llm/config`, {
    headers: getAuthHeaders(token),
  });
}

export async function adminTestLlm(token: string): Promise<{ ok: boolean; message?: string }> {
  return apiClient.post<{ ok: boolean; message?: string }>(`${BASE_PATH}/api/admin/llm/test`, undefined, {
    headers: getAuthHeaders(token),
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function adminGetStats(token: string): Promise<AdminStats> {
  return apiClient.get<AdminStats>(`${BASE_PATH}/api/admin/stats`, {
    headers: getAuthHeaders(token),
  });
}
