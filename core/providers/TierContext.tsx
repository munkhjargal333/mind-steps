// core/providers/TierContext.tsx
'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { Tier } from '@/core/api/types';
import { useAuth } from '@/core/auth/AuthContext';
import { createClient } from '@/core/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TierContextValue {
  tier:        Tier;
  loading:     boolean;
  token:       string | null;
  refreshTier: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const TierContext = createContext<TierContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function TierProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const supabase = createClient();

  const [tier,    setTier]    = useState<Tier>('demo');
  const [loading, setLoading] = useState(true);

  const fetchTier = async () => {
    if (!user) {
      setTier('demo');
      setLoading(false);
      return;
    }

    try {
      // 1. Optimistic: JWT-ээс шууд унших (network хэрэггүй, хурдан)
      const jwtTier = (user.app_metadata?.tier as Tier) ?? 'free';
      setTier(jwtTier);

      // 2. Authoritative: DB-ээс expiry шалгах
      const { data, error } = await supabase
        .from('users')
        .select('tier, tier_expires_at')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const expired =
          data.tier_expires_at && new Date(data.tier_expires_at) < new Date();
        setTier(expired ? 'free' : (data.tier as Tier));
      }
    } catch (err) {
      console.error('[TierContext] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // QPay болон бусад төлбөрийн дараа дуудна.
  // JWT refresh + DB re-read хийж tier-ийг шинэчилнэ.
  const refreshTier = async () => {
    setLoading(true);
    await supabase.auth.refreshSession();
    await fetchTier();
  };

  return (
    <TierContext.Provider value={{ tier, loading, token, refreshTier }}>
      {children}
    </TierContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTierContext(): TierContextValue {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error('useTierContext must be used within TierProvider');
  return ctx;
}