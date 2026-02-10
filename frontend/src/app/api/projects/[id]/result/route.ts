import { NextRequest, NextResponse } from 'next/server';

// Mock results data
const mockResults: Record<string, any> = {
  '1': {
    id: 'r1',
    projectId: '1',
    summary: '캠퍼스 탄소중립 2030 로드맵을 성공적으로 수립하고 1차년도 목표를 달성하였습니다.',
    achievement: '태양광 패널 50kW 설치 완료, LED 조명 전면 교체, 전기차 충전소 5개소 설치',
    quantitativeResult: '탄소 배출량 전년 대비 12% 감축 달성 (2,340톤 → 2,059톤)',
    qualitativeResult: '캠퍼스 내 태양광 패널 설치, LED 조명 교체, 전기차 충전 인프라 구축 등 친환경 인프라 전환 사업을 체계적으로 추진하였습니다. 특히 건물 에너지 효율화 사업을 통해 냉난방 에너지 사용량을 크게 절감하였으며, 학생·교직원 대상 탄소중립 인식 제고 캠페인을 분기별로 시행하였습니다.',
    budgetUsed: 230000000,
    issues: '일부 노후 건물의 에너지 효율화 공사가 예산 문제로 지연됨',
    nextSteps: '2026년 추가 예산 확보 및 정부 보조금 연계 사업으로 전환 추진',
    images: [],
    documents: [],
    completedAt: '2025-12-15T00:00:00Z',
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z',
  },
  '2': {
    id: 'r2',
    projectId: '2',
    summary: '다문화 학생 지원 프로그램을 성공적으로 운영하여 학업 중도 탈락률을 크게 줄였습니다.',
    achievement: '다문화 학생 멘토링 120명 참여, 학업 중도 탈락률 35% 감소',
    quantitativeResult: '다문화 학생 멘토링 참여 120명, 만족도 4.7/5.0',
    qualitativeResult: '다문화 학생 전담 상담사 배치, 한국어 튜터링 프로그램 운영, 문화 교류 행사를 정기적으로 개최하여 캠퍼스 내 다양성과 포용성을 증진하였습니다.',
    budgetUsed: 75000000,
    issues: '비대면 상담 인프라가 부족하여 원격 학생 지원에 한계',
    nextSteps: '온라인 상담 플랫폼 도입 및 24시간 상담 핫라인 운영 계획',
    images: [],
    documents: [],
    completedAt: '2025-11-30T00:00:00Z',
    createdAt: '2025-12-05T00:00:00Z',
    updatedAt: '2025-12-05T00:00:00Z',
  },
  '5': {
    id: 'r5',
    projectId: '5',
    summary: '지역사회 상생 봉사 프로그램을 통해 대학의 사회적 책임을 적극 실천하였습니다.',
    achievement: '봉사활동 참여 학생 850명, 활동 시간 12,000시간 달성',
    quantitativeResult: '봉사활동 참여 학생 850명, 활동 시간 12,000시간',
    qualitativeResult: '지역 소외 계층을 위한 교육 봉사, IT 기기 활용 교육, 독거노인 돌봄 서비스 등 다양한 봉사 프로그램을 운영하였습니다.',
    budgetUsed: 42000000,
    issues: null,
    nextSteps: '봉사 마일리지 제도를 도입하여 학생 참여 동기 강화',
    images: [],
    documents: [],
    completedAt: '2025-12-20T00:00:00Z',
    createdAt: '2025-12-25T00:00:00Z',
    updatedAt: '2025-12-25T00:00:00Z',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = mockResults[params.id];
  if (!result) {
    return NextResponse.json({ message: '결과가 아직 등록되지 않았습니다.' }, { status: 404 });
  }
  return NextResponse.json(result);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const newResult = {
    id: `r-${Date.now()}`,
    projectId: params.id,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockResults[params.id] = newResult;
  return NextResponse.json(newResult, { status: 201 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const existing = mockResults[params.id];
  if (!existing) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
  mockResults[params.id] = updated;
  return NextResponse.json(updated);
}
