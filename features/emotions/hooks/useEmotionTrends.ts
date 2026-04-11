'use client'

import { useState, useCallback, useEffect } from 'react'
import { getEmotionStats, type EmotionStat } from '@/lib/api/journalBackend'

interface UseEmotionTrendsOptions {
  token: string | null
  days?: number
  autoFetch?: boolean
}

export function useEmotionTrends({ token, days = 30, autoFetch = true }: UseEmotionTrendsOptions) {
  const [trends, setTrends] = useState<EmotionStat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrends = useCallback(async () => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const data = await getEmotionStats(token, days)
      setTrends(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Сэтгэлийн хандлагыг авахад алдаа гарлаа'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [token, days])

  useEffect(() => {
    if (autoFetch && token) {
      fetchTrends()
    }
  }, [autoFetch, token, fetchTrends])

  const refresh = useCallback(() => {
    return fetchTrends()
  }, [fetchTrends])

  // Calculate top emotions
  const topEmotions = trends
    .slice()
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)

  // Calculate positive vs negative ratio
  const positiveEmotions = ['joy', 'love', 'surprise']
  const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust']

  const positiveScore = trends
    .filter((e) => positiveEmotions.includes(e.emotion.toLowerCase()))
    .reduce((sum, e) => sum + e.score_sum, 0)

  const negativeScore = trends
    .filter((e) => negativeEmotions.includes(e.emotion.toLowerCase()))
    .reduce((sum, e) => sum + e.score_sum, 0)

  const sentimentRatio = positiveScore + negativeScore > 0
    ? positiveScore / (positiveScore + negativeScore)
    : 0.5

  return {
    trends,
    topEmotions,
    sentimentRatio,
    loading,
    error,
    refresh,
    clearError: () => setError(null),
  }
}
