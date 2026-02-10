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
