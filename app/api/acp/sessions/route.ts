import { NextRequest, NextResponse } from 'next/server';
import { getCTAccessToken } from '@/lib/acp-token';

export async function POST(req: NextRequest) {
  const host = process.env.ACP_SERVICE_HOST;
  if (!host) {
    return NextResponse.json({ error: 'ACP_SERVICE_HOST not configured' }, { status: 500 });
  }

  const body = await req.json();
  const requestBody = {
    buyer: body.buyer,
    items: body.items,
    fulfillment_address: body.fulfillmentAddress,
  };

  const url = `${host}/checkout_sessions`;

  let token: string;
  try {
    token = await getCTAccessToken();
  } catch (err) {
    return NextResponse.json({ error: `Auth failed: ${String(err)}` }, { status: 500 });
  }

  const acpResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
    context: {
      stepName: 'ACP Step 1 — Create Session',
      system: 'commercetools ACP',
      description:
        'Initialises a new checkout session with buyer information, line items, and fulfilment address. ' +
        'commercetools ACP validates the cart, reserves inventory, and returns the available shipping options for the buyer to choose from.',
    },
  };

  if (!acpResponse.ok) {
    return NextResponse.json({ error: 'Session creation failed', apiEntry }, { status: acpResponse.status });
  }

  return NextResponse.json({ sessionId: responseBody.id, responseBody, apiEntry });
}
