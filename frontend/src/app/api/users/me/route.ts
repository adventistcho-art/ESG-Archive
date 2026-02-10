import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');

  if (!auth || !auth.startsWith('Bearer mock-jwt-token-')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = auth.replace('Bearer mock-jwt-token-', '');

  const users: Record<string, any> = {
    u1: { id: 'u1', email: 'admin@university.ac.kr', deptName: '기획처', role: 'ADMIN' },
    u2: { id: 'u2', email: 'design@university.ac.kr', deptName: '디자인학과', role: 'USER' },
  };

  const user = users[userId];
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
