import { NextResponse } from 'next/server';
import { getStripeToken, getTokenStatus } from '@/lib/stripe-token';

export async function GET() {
  try {
    const token = await getStripeToken();
    return NextResponse.json({ token, ready: true });
  } catch (err) {
    const { error } = getTokenStatus();
    return NextResponse.json({ ready: false, error: error ?? String(err) }, { status: 500 });
  }
}
