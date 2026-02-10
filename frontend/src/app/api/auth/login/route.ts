import { NextRequest, NextResponse } from 'next/server';

const mockUsers = [
  {
    id: 'u1',
    email: 'admin@university.ac.kr',
    password: 'admin123',
    deptName: '기획처',
    role: 'ADMIN' as const,
  },
  {
    id: 'u2',
    email: 'design@university.ac.kr',
    password: 'user1234',
    deptName: '디자인학과',
    role: 'USER' as const,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      access_token: 'mock-jwt-token-' + user.id,
      user: {
        id: user.id,
        email: user.email,
        deptName: user.deptName,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { message: '요청을 처리할 수 없습니다.' },
      { status: 400 }
    );
  }
}
