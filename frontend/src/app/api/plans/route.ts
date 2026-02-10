import { NextRequest, NextResponse } from 'next/server';

const mockPlans = [
  // 2026 Plans
  {
    id: 'p1',
    year: 2026,
    category: 'ENVIRONMENT',
    title: '탄소중립 캠퍼스 2단계 추진',
    description: '2025년 1단계 성과를 기반으로 캠퍼스 탄소 배출량을 추가 20% 감축하는 2단계 사업을 추진합니다.',
    deptName: '총무처',
    task: '탄소중립 추진',
    goals: ['잔여 건물 태양광 패널 설치', '에너지 저장 시스템(ESS) 도입', '캠퍼스 내 전기 셔틀 운행'],
    kpiTargets: [
      { name: '탄소 배출 감축률', target: '20', unit: '%' },
      { name: '재생에너지 사용 비율', target: '35', unit: '%' },
      { name: '에너지 비용 절감', target: '4', unit: '억원' },
    ],
    budget: 400000000,
    timeline: '2026.03 ~ 2026.12',
    status: 'PLANNED',
  },
  {
    id: 'p2',
    year: 2026,
    category: 'ENVIRONMENT',
    title: 'ECO-Farm 고도화 및 농생명 교육',
    description: '기존 ECO-Farm을 확대하고 스마트팜 기술을 도입하여 교육과 연구에 활용합니다.',
    deptName: '시설관리처',
    task: 'ECO-Farm 육성',
    goals: ['스마트팜 온실 설치', 'ECO-Farm 면적 2배 확대', '농생명 교과 2과목 개설'],
    kpiTargets: [
      { name: 'ECO-Farm 면적', target: '2000', unit: '㎡' },
      { name: '참여 학생 수', target: '200', unit: '명' },
    ],
    budget: 150000000,
    timeline: '2026.03 ~ 2026.11',
    status: 'PLANNED',
  },
  {
    id: 'p3',
    year: 2026,
    category: 'SOCIAL',
    title: '서비스러닝 확대 및 지역 연계 강화',
    description: '서비스러닝 교과목을 전 학과로 확대하고 지역사회 파트너십을 강화합니다.',
    deptName: '학생처',
    task: '서비스러닝 교과',
    goals: ['서비스러닝 교과 10개 학과 확대', '지역사회 MOU 20건 체결', '학생 봉사시간 20,000시간 달성'],
    kpiTargets: [
      { name: '서비스러닝 교과 수', target: '15', unit: '과목' },
      { name: '참여 학생 수', target: '1200', unit: '명' },
      { name: '지역사회 MOU', target: '20', unit: '건' },
    ],
    budget: 100000000,
    timeline: '2026.03 ~ 2026.12',
    status: 'PLANNED',
  },
  {
    id: 'p4',
    year: 2026,
    category: 'SOCIAL',
    title: '캡스톤 디자인 산학협력 강화',
    description: '산업체와 연계한 캡스톤 디자인 프로젝트를 확대하여 학생의 실무 역량을 강화합니다.',
    deptName: '대외협력처',
    task: '캡스톤 디자인 활성화',
    goals: ['산학협력 캡스톤 30팀 운영', '기업 멘토 50명 확보', '프로젝트 결과물 상용화 5건'],
    kpiTargets: [
      { name: '참여 팀 수', target: '30', unit: '팀' },
      { name: '기업 멘토', target: '50', unit: '명' },
      { name: '상용화 건수', target: '5', unit: '건' },
    ],
    budget: 200000000,
    timeline: '2026.03 ~ 2026.12',
    status: 'PLANNED',
  },
  {
    id: 'p5',
    year: 2026,
    category: 'GOVERNANCE',
    title: 'ESG 통합 데이터 플랫폼 구축',
    description: 'ESG 성과를 실시간으로 모니터링하고 분석할 수 있는 통합 데이터 플랫폼을 구축합니다.',
    deptName: '기획처',
    task: 'ESG 플랫폼 구축',
    goals: ['ESG 대시보드 시스템 개발', '부서별 성과 자동 수집 체계', '외부 공시 자동화'],
    kpiTargets: [
      { name: '데이터 수집 자동화율', target: '80', unit: '%' },
      { name: '실시간 모니터링 지표', target: '50', unit: '개' },
    ],
    budget: 300000000,
    timeline: '2026.04 ~ 2026.12',
    status: 'PLANNED',
  },
  {
    id: 'p6',
    year: 2026,
    category: 'GOVERNANCE',
    title: '내부 감사 체계 고도화',
    description: '상시 감사 체계를 구축하고 AI 기반 이상 탐지 시스템을 도입합니다.',
    deptName: '감사실',
    task: '내부감사 부서 설치',
    goals: ['상시 감사 시스템 도입', 'AI 이상거래 탐지 시스템', '감사 결과 실시간 공개'],
    kpiTargets: [
      { name: '감사 이행률', target: '100', unit: '%' },
      { name: '이상거래 탐지율', target: '95', unit: '%' },
    ],
    budget: 80000000,
    timeline: '2026.03 ~ 2026.09',
    status: 'PLANNED',
  },
  // 2025 Plans (some completed)
  {
    id: 'p7',
    year: 2025,
    category: 'ENVIRONMENT',
    title: '캠퍼스 탄소중립 2030 로드맵 수립',
    description: '2030년까지 캠퍼스 탄소 배출량 50% 감축을 위한 단계별 실행 계획을 수립합니다.',
    deptName: '총무처',
    task: '탄소중립 추진',
    goals: ['태양광 패널 설치', 'LED 조명 전면 교체', '전기차 충전 인프라 구축'],
    kpiTargets: [
      { name: '탄소 배출 감축률', target: '12', unit: '%' },
      { name: '태양광 설치 용량', target: '50', unit: 'kW' },
    ],
    budget: 250000000,
    timeline: '2025.03 ~ 2025.12',
    status: 'COMPLETED',
  },
  {
    id: 'p8',
    year: 2025,
    category: 'SOCIAL',
    title: '다문화 학생 지원 프로그램 운영',
    description: '다문화 배경 학생의 학업 적응과 심리 상담을 위한 통합 지원 체계를 구축합니다.',
    deptName: '학생처',
    task: '다문화 지원',
    goals: ['전담 상담사 배치', '한국어 튜터링 프로그램', '문화 교류 행사 개최'],
    kpiTargets: [
      { name: '멘토링 참여', target: '100', unit: '명' },
      { name: '만족도', target: '4.5', unit: '/5.0' },
    ],
    budget: 80000000,
    timeline: '2025.03 ~ 2025.12',
    status: 'COMPLETED',
  },
  {
    id: 'p9',
    year: 2025,
    category: 'GOVERNANCE',
    title: '대학 윤리경영 체계 고도화',
    description: '투명한 대학 운영을 위한 윤리경영 시스템을 구축하고 내부 감사 체계를 강화합니다.',
    deptName: '기획처',
    task: '윤리경영',
    goals: ['윤리경영위원회 정례화', '전 구성원 윤리교육 의무화', '익명 제보 시스템 도입'],
    kpiTargets: [
      { name: '윤리교육 이수율', target: '95', unit: '%' },
      { name: '감사 이행률', target: '90', unit: '%' },
    ],
    budget: 50000000,
    timeline: '2025.03 ~ 2025.12',
    status: 'COMPLETED',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');

  let filtered = mockPlans;
  if (year) {
    filtered = filtered.filter((p) => p.year === Number(year));
  }

  return NextResponse.json(filtered);
}
