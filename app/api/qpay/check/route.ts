// app/api/qpay/check/route.ts
// Routing only — auth check, then delegates to payment service.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAndUpgrade, type Plan } from '@/features/payment';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { invoice_id, plan } = await req.json() as { invoice_id: string; plan: Plan };
    const result = await verifyAndUpgrade(user.id, invoice_id, plan);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('QPay check error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
