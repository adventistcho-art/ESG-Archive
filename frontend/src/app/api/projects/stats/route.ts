import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total: 9,
    environment: 3,
    social: 3,
    governance: 3,
  });
}
