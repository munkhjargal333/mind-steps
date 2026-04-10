// features/payment/api/qpay.api.ts
// Raw QPay HTTP calls — no auth, no business logic, no Next.js deps.
// Called only from server-side code (route handlers / server actions).

const QPAY_BASE =
  process.env.QPAY_BASE_URL ?? 'https://merchant-sandbox.qpay.mn/v2';
const QPAY_USERNAME = process.env.QPAY_USERNAME ?? 'TEST_VENDOR_MERCHANT';
const QPAY_PASSWORD = process.env.QPAY_PASSWORD ?? '123456';
const QPAY_INVOICE_CODE =
  process.env.QPAY_INVOICE_CODE ?? 'TEST_INVOICE';

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${QPAY_USERNAME}:${QPAY_PASSWORD}`
  ).toString('base64');

  const res = await fetch(`${QPAY_BASE}/auth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('QPay auth failed');
  const data = await res.json();
  return data.access_token as string;
}

export interface QPayInvoiceResult {
  invoice_id: string;
  qr_text: string;
  qr_image: string; // base64 PNG
  urls: unknown[];
  amount: number;
}

export interface QPayCheckResult {
  paid: boolean;
  rows: unknown[];
}

export async function createQPayInvoice(params: {
  userId: string;
  plan: string;
  amount: number;
}): Promise<QPayInvoiceResult> {
  const token = await getAccessToken();

  const res = await fetch(`${QPAY_BASE}/invoice`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invoice_code: QPAY_INVOICE_CODE,
      sender_invoice_no: `${params.userId}-${Date.now()}`,
      invoice_receiver_code: 'terminal',
      invoice_description: `MindSteps ${params.plan} план`,
      amount: params.amount,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/qpay/callback?user_id=${params.userId}&plan=${params.plan}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Invoice creation failed: ${err}`);
  }

  const invoice = await res.json();
  return {
    invoice_id: invoice.invoice_id,
    qr_text: invoice.qr_text,
    qr_image: invoice.qr_image,
    urls: invoice.urls ?? [],
    amount: params.amount,
  };
}

export async function checkQPayPayment(
  invoiceId: string
): Promise<QPayCheckResult> {
  const token = await getAccessToken();

  const res = await fetch(`${QPAY_BASE}/payment/check`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      object_type: 'INVOICE',
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 10 },
    }),
  });

  if (!res.ok) throw new Error('Payment check failed');

  const result = await res.json();
  const paid: boolean =
    result.count > 0 &&
    result.rows?.some((r: { payment_status: string }) => r.payment_status === 'PAID');

  return { paid, rows: result.rows ?? [] };
}
