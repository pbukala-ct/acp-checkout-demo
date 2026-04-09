import { NextRequest, NextResponse } from 'next/server';
import { getCTAccessToken } from '@/lib/acp-token';

// GET — fetch current session state
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const host = process.env.ACP_SERVICE_HOST;
  if (!host) {
    return NextResponse.json({ error: 'ACP_SERVICE_HOST not configured' }, { status: 500 });
  }

  const url = `${host}/checkout_sessions/${id}`;

  let token: string;
  try {
    token = await getCTAccessToken();
  } catch (err) {
    return NextResponse.json({ error: `Auth failed: ${String(err)}` }, { status: 500 });
  }

  const acpResponse = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const responseBody = await acpResponse.json().catch(() => ({}));

  const apiEntry = {
    method: 'GET',
    url,
    status: acpResponse.status,
    requestBody: null,
    responseBody,
    isError: !acpResponse.ok,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ responseBody, apiEntry });
}

// POST — update session
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const host = process.env.ACP_SERVICE_HOST;
  if (!host) {
    return NextResponse.json({ error: 'ACP_SERVICE_HOST not configured' }, { status: 500 });
  }

  const body = await req.json();
  const url = `${host}/checkout_sessions/${id}`;

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
    body: JSON.stringify(body),
  });

  const responseBody = await acpResponse.json().catch(() => ({}));

  const apiEntry = {
    method: 'POST',
    url,
    status: acpResponse.status,
    requestBody: body,
    responseBody,
    isError: !acpResponse.ok,
    timestamp: new Date().toISOString(),
    context: {
      stepName: 'ACP Step 2 — Select Shipping',
      system: 'commercetools ACP',
      description:
        'Applies the buyer\'s chosen fulfilment option to the active checkout session. ' +
        'commercetools ACP updates the session with the selected delivery method and recalculates the order total including shipping costs.',
    },
  };

  return NextResponse.json({ responseBody, apiEntry });
}
