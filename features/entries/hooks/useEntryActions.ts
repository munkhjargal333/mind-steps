'use client'

import { useState, useCallback } from 'react'
import {
  createEntry as apiCreateEntry,
  updateEntry as apiUpdateEntry,
  deleteEntry as apiDeleteEntry,
  type EntryCreateRequest,
  type EntryResponse,
} from '@/lib/api/journalBackend'

interface UseEntryActionsOptions {
  token: string | null
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useEntryActions({ token, onSuccess, onError }: UseEntryActionsOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEntry = useCallback(
    async (data: EntryCreateRequest): Promise<EntryResponse | null> => {
      if (!token) {
        setError('Нэвтрэх токен байхгүй байна')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const result = await apiCreateEntry(token, data)
        onSuccess?.()
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Бичлэг үүсгэхэд алдаа гарлаа'
        setError(message)
        onError?.(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [token, onSuccess, onError]
  )

  const updateEntry = useCallback(
    async (entryId: string, data: Partial<EntryCreateRequest>): Promise<boolean> => {
      if (!token) {
        setError('Нэвтрэх токен байхгүй байна')
        return false
      }

      setLoading(true)
      setError(null)

      try {
        await apiUpdateEntry(token, entryId, data)
        onSuccess?.()
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Бичлэг шинэчлэхэд алдаа гарлаа'
        setError(message)
        onError?.(message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [token, onSuccess, onError]
  )

  const deleteEntry = useCallback(
    async (entryId: string): Promise<boolean> => {
      if (!token) {
        setError('Нэвтрэх токен байхгүй байна')
        return false
      }

      setLoading(true)
      setError(null)

      try {
        await apiDeleteEntry(token, entryId)
        onSuccess?.()
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Бичлэг устгахад алдаа гарлаа'
        setError(message)
        onError?.(message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [token, onSuccess, onError]
  )

  return {
    createEntry,
    updateEntry,
    deleteEntry,
    loading,
    error,
    clearError: () => setError(null),
  }
}
