'use client'

import { useState, useCallback, useEffect } from 'react'
import { listDeepInsights, type DeepInsight } from '@/features/insights/api/insights.api'

interface UseInsightGenerationOptions {
  token: string | null
  autoFetch?: boolean
}

export function useInsightGeneration({ token, autoFetch = true }: UseInsightGenerationOptions) {
  const [insights, setInsights] = useState<DeepInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const data = await listDeepInsights(token)
      setInsights(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Гүнзгийрүүлсэн шинжилгээ авахад алдаа гарлаа'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (autoFetch && token) {
      fetchInsights()
    }
  }, [autoFetch, token, fetchInsights])

  const refresh = useCallback(() => {
    return fetchInsights()
  }, [fetchInsights])

  return {
    insights,
    loading,
    error,
    refresh,
    clearError: () => setError(null),
  }
}
