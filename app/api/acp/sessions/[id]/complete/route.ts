import { NextRequest, NextResponse } from 'next/server';
import { getCTAccessToken } from '@/lib/acp-token';
import { getStripeToken } from '@/lib/stripe-token';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const host = process.env.ACP_SERVICE_HOST;
  if (!host) {
    return NextResponse.json({ error: 'ACP_SERVICE_HOST not configured' }, { status: 500 });
  }

  const body = await req.json();

  let stripeToken: string;
  try {
    stripeToken = await getStripeToken();
  } catch (err) {
    return NextResponse.json({ error: `Stripe token unavailable: ${String(err)}` }, { status: 500 });
  }

  let ctToken: string;
  try {
    ctToken = await getCTAccessToken();
  } catch (err) {
    return NextResponse.json({ error: `Auth failed: ${String(err)}` }, { status: 500 });
  }

  const requestBody = {
    payment_data: {
      token: stripeToken,
      provider: 'stripe',
      billing_address: body.billingAddress ?? body.fulfillmentAddress,
    },
    buyer: body.buyer,
  };

  const url = `${host}/checkout_sessions/${id}/complete`;

  const acpResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ctToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseBody = await acpResponse.json().catch(() => ({}));

  const apiEntry = {
    method: 'POST',
    url,
    status: acpResponse.status,
    requestBody,
    responseBody,
    isError: !acpResponse.ok,
    timestamp: new Date().toISOString(),
  };

  if (!acpResponse.ok) {
    return NextResponse.json({ error: 'Checkout completion failed', apiEntry }, { status: acpResponse.status });
  }

  return NextResponse.json({ success: true, responseBody, apiEntry });
}
