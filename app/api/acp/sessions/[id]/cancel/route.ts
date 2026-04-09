import { NextRequest, NextResponse } from 'next/server';
import { getCTAccessToken } from '@/lib/acp-token';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const host = process.env.ACP_SERVICE_HOST;
  if (!host) {
    return NextResponse.json({ error: 'ACP_SERVICE_HOST not configured' }, { status: 500 });
  }

  const url = `${host}/checkout_sessions/${id}/cancel`;

  let token: string;
  try {
    token = await getCTAccessToken();
  } catch (err) {
    return NextResponse.json({ error: `Auth failed: ${String(err)}` }, { status: 500 });
  }

  const acpResponse = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const responseBody = await acpResponse.json().catch(() => ({}));

  const apiEntry = {
    method: 'POST',
    url,
    status: acpResponse.status,
    requestBody: null,
    responseBody,
    isError: !acpResponse.ok,
    timestamp: new Date().toISOString(),
    context: {
      stepName: 'ACP — Cancel Session',
      system: 'commercetools ACP',
      description:
        'Terminates the active checkout session and unfreezes the associated commercetools cart, ' +
        'returning it to an editable state so a new checkout attempt can be started.',
    },
  };

  return NextResponse.json({ apiEntry });
}
