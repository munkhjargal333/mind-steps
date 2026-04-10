// features/payment/services/payment.service.ts
// Business logic for QPay payments: pricing, plan validation, tier update.
// Server-only — imports Supabase server client.

import { createClient } from '@/lib/supabase/server';
import {
  createQPayInvoice,
  checkQPayPayment,
  type QPayInvoiceResult,
  type QPayCheckResult,
} from '../api/qpay.api';

export type Plan = 'free' | 'pro';

const PLAN_PRICES: Record<Plan, number> = {
  free: 0,
  pro: 9900, // MNT
};

export function getPlanAmount(plan: Plan): number {
  return PLAN_PRICES[plan] ?? 0;
}

export async function initiatePayment(
  userId: string,
  plan: Plan
): Promise<QPayInvoiceResult> {
  const amount = getPlanAmount(plan);
  return createQPayInvoice({ userId, plan, amount });
}

export async function verifyAndUpgrade(
  userId: string,
  invoiceId: string,
  plan: Plan
): Promise<QPayCheckResult> {
  const result = await checkQPayPayment(invoiceId);

  if (result.paid) {
    const supabase = await createClient();
    await supabase
      .from('profiles')
      .update({ tier: plan, upgraded_at: new Date().toISOString() })
      .eq('id', userId);
  }

  return result;
}
