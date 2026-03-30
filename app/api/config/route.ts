import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ctpProjectKey: process.env.CTP_PROJECT_KEY ?? null,
  });
}
