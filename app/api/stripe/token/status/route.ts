import { NextResponse } from 'next/server';
import { getTokenStatus } from '@/lib/stripe-token';

export async function GET() {
  return NextResponse.json(getTokenStatus());
}
