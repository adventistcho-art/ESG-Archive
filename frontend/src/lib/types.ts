export type EsgType = 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE';

export interface User {
  id: string;
  email: string;
  deptName: string;
  role: 'USER' | 'ADMIN';
}

export interface EsgProject {
  id: string;
  year: number;
  deptName: string;
  title: string;
  category: EsgType;
  task: string;
  thumbnail: string | null;
  oneLineSummary: string | null;
  quantitative: string | null;
  qualitative: string;
  budget: number | null;
  shortcoming: string | null;
  improvement: string | null;
  images: string[];
  documents: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    email: string;
    deptName: string;
  };
  // 결과 등록 여부
  hasResult?: boolean;
  result?: ProjectResult | null;
}

// 프로젝트 결과 (부서별 작성)
export interface ProjectResult {
  id: string;
  projectId: string;
  summary: string; // 결과 요약
  achievement: string; // 주요 성과
  quantitativeResult: string | null; // 정량적 결과
  qualitativeResult: string; // 정성적 결과
  budgetUsed: number | null; // 실제 집행 예산
  issues: string | null; // 이슈 및 문제점
  nextSteps: string | null; // 향후 계획
  images: string[];
  documents: string[];
  completedAt: string; // 완료일
  createdAt: string;
  updatedAt: string;
}

// ESG 연간 계획
export interface EsgPlan {
  id: string;
  year: number;
  category: EsgType;
  title: string;
  description: string;
  deptName: string;
  task: string;
  goals: string[]; // 목표
  kpiTargets: KpiTarget[]; // KPI 목표
  budget: number | null; // 예산 계획
  timeline: string; // 추진 일정
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface KpiTarget {
  name: string;
  target: string;
  unit: string;
}

// ESG 백서 (연간 보고서)
export interface EsgWhitePaper {
  id: string;
  year: number;
  title: string;
  overview: string; // 연도 개요
  highlights: string[]; // 주요 성과 요약
  totalBudget: number;
  totalProjects: number;
  environmentSummary: CategorySummary;
  socialSummary: CategorySummary;
  governanceSummary: CategorySummary;
  publishedAt: string;
}

export interface CategorySummary {
  totalProjects: number;
  totalBudget: number;
  completedProjects: number;
  highlights: string[];
  keyResults: string[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ProjectFilter {
  year?: number;
  category?: EsgType;
  deptName?: string;
}

// 성과상여금 안건 관련
export type ProposalGrade = 'S' | 'A' | 'B' | 'C' | 'D';
export type ProposalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVIEWING';

// 성과 개요
export interface PerformanceOverview {
  description: string; // 미래교육혁신을 위해 정부는...
  projectName: string; // 이를 위해 000는 000사업을 수주, 000 등의 성과를 세움
  futureActivities: string; // 향후 이를 통해 000, 000 등의 활동...
}

// 사업결의번호
export interface ProjectResolution {
  resolution: string; // 행정위00-00, 000사업 추진
}

// 성과담당자 정보
export interface PerformanceManager {
  dept: string; // 부서명
  position: string; // 직책
  name: string; // 성명
  period: string; // 업무기간 (2023.3.5~8.10)
  content: string; // 참여내용
}

// 증빙자료 목록
export interface EvidenceDocument {
  year: string; // 연번
  title: string; // 제목
  workPlan: string; // 과업명 (예: 행정위원회 회의록(2023-00))
}

// 성과상여금 안건
export interface PerformanceProposal {
  id: string;
  // 기본 정보
  title: string; // 안건 제목
  submitterId: string; // 제출자 ID
  submitterName: string; // 제출자 이름
  submitterDept: string; // 제출자 부서
  submittedAt: string; // 제출일
  
  // 성과 개요
  overview: PerformanceOverview;
  
  // 사업결의번호
  resolution: ProjectResolution;
  
  // 성과담당자 (여러 명 가능)
  managers: PerformanceManager[];
  
  // 증빙자료 목록
  evidenceDocuments: EvidenceDocument[];
  
  // 첨부파일
  attachments: string[];
  
  // 상태 및 평가
  status: ProposalStatus;
  grade?: ProposalGrade; // 관리자가 지정
  comments?: string; // 심사 의견
  reviewedAt?: string; // 심사일
  reviewedBy?: string; // 심사자
  
  createdAt: string;
  updatedAt: string;
}
