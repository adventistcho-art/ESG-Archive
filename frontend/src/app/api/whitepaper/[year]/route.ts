import { NextRequest, NextResponse } from 'next/server';

// Re-use whitepaper data - in real app this would come from DB
export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {
  // Fetch from the main whitepaper endpoint and filter
  const baseUrl = request.nextUrl.origin;
  const res = await fetch(`${baseUrl}/api/whitepaper`);
  const all = await res.json();
  const wp = all.find((w: any) => w.year === Number(params.year));
  
  if (!wp) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(wp);
}
