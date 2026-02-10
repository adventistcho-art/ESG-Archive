import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([2026, 2025]);
}
