import { NextResponse } from 'next/server';

const mockWhitePapers = [
  {
    id: 'wp2025',
    year: 2025,
    title: '2025 ESG 경영 백서',
    overview: '2025년은 대학 ESG 경영 원년으로, 환경·사회·거버넌스 3대 영역에서 총 9개 핵심 프로젝트를 추진하여 의미 있는 성과를 달성하였습니다. 특히 캠퍼스 탄소 배출량 12% 감축, 다문화 학생 지원 체계 구축, 윤리경영 체계 고도화 등 각 영역에서 구체적인 성과를 이루었습니다.',
    highlights: [
      '캠퍼스 탄소 배출량 전년 대비 12% 감축 달성',
      '다문화 학생 학업 중도 탈락률 35% 감소',
      '윤리교육 이수율 98%, 내부 감사 이행률 95% 달성',
      '지역사회 봉사활동 참여 학생 850명, 12,000시간',
      '정보공개 건수 전년 대비 40% 증가',
      '캠퍼스 녹지 면적 15% 확대, 자생식물 50종 식재',
    ],
    totalBudget: 635000000,
    totalProjects: 6,
    environmentSummary: {
      totalProjects: 2,
      totalBudget: 430000000,
      completedProjects: 2,
      highlights: [
        '캠퍼스 탄소중립 2030 로드맵 수립 완료',
        '캠퍼스 생태 복원 및 녹지 확충 사업 완료',
      ],
      keyResults: [
        '태양광 패널 50kW 설치, CO2 감축 12% 달성',
        '녹지 면적 15% 확대, 자생식물 50종 식재',
        'LED 조명 전면 교체 완료',
        '전기차 충전소 5개소 설치',
      ],
    },
    socialSummary: {
      totalProjects: 2,
      totalBudget: 125000000,
      completedProjects: 2,
      highlights: [
        '다문화 학생 통합 지원 체계 구축',
        '지역사회 상생 봉사 프로그램 운영',
      ],
      keyResults: [
        '다문화 학생 멘토링 120명 참여, 만족도 4.7/5.0',
        '학업 중도 탈락률 35% 감소',
        '봉사활동 참여 학생 850명, 12,000시간',
        '지역 중소기업 재능기부 협약 체결',
      ],
    },
    governanceSummary: {
      totalProjects: 2,
      totalBudget: 80000000,
      completedProjects: 2,
      highlights: [
        '대학 윤리경영 체계 고도화',
        '정보공개 투명성 강화',
      ],
      keyResults: [
        '윤리교육 이수율 98%, 내부 감사 이행률 95%',
        '익명 제보 시스템 도입',
        '정보공개 건수 전년 대비 40% 증가',
        '이해관계자 만족도 4.5/5.0',
      ],
    },
    publishedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'wp2024',
    year: 2024,
    title: '2024 ESG 경영 백서',
    overview: '2024년은 ESG 경영 체계를 도입하고 기반을 마련한 해입니다. IoT 기반 스마트 캠퍼스 구축, 장애학생 학습권 보장, ESG 경영 선포 등 핵심 사업을 성공적으로 수행하였습니다.',
    highlights: [
      '전력 사용량 18% 절감, 연간 3억원 에너지 비용 절약',
      '장애학생 보조공학 기기 50대 보급',
      'ESG 위원회 설치 및 최초 ESG 보고서 발간',
    ],
    totalBudget: 655000000,
    totalProjects: 3,
    environmentSummary: {
      totalProjects: 1,
      totalBudget: 500000000,
      completedProjects: 1,
      highlights: ['에너지 절감형 스마트 캠퍼스 구축'],
      keyResults: [
        '전력 사용량 18% 절감',
        '에너지 비용 연간 3억원 절약',
        'IoT 에너지 모니터링 시스템 설치',
        'AI 기반 냉난방 자동 제어 도입',
      ],
    },
    socialSummary: {
      totalProjects: 1,
      totalBudget: 120000000,
      completedProjects: 1,
      highlights: ['장애학생 학습권 보장 사업'],
      keyResults: [
        '보조공학 기기 50대 보급',
        '장애학생 만족도 4.8/5.0',
        '강의실 접근성 개선 공사 실시',
        '장애학생 전담 튜터 제도 확대',
      ],
    },
    governanceSummary: {
      totalProjects: 1,
      totalBudget: 35000000,
      completedProjects: 1,
      highlights: ['ESG 경영 체계 도입'],
      keyResults: [
        'ESG 위원회 설치',
        'ESG 보고서 최초 발간',
        'ESG 경영 선포식 개최',
        '총장 직속 ESG위원회 구성',
      ],
    },
    publishedAt: '2025-01-20T00:00:00Z',
  },
];

export async function GET() {
  return NextResponse.json(mockWhitePapers);
}
