import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([2025, 2024]);
}
