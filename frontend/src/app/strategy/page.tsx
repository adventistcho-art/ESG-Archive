'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Users,
  Shield,
  ChevronLeft,
  BookOpen,
  Heart,
  Smile,
  BookOpenCheck,
  Sprout,
  TreePine,
  Recycle,
  Globe2,
  Building2,
  FileText,
  Network,
  Megaphone,
  Link2,
  GraduationCap,
  Lightbulb,
  FlaskConical,
  UserCheck,
  Scale,
  BarChart3,
  Wallet,
  TrendingUp,
  Target,
  Eye,
  Landmark,
  Award,
} from 'lucide-react';
import Header from '@/components/Header';

// ─── 데이터 ───

const strategyPillars = [
  {
    id: 'environment',
    label: 'Environment',
    labelKr: '환경',
    direction: '친환경/에너지 절약 생활화',
    color: '#10b981',
    bgColor: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: Leaf,
    items: [
      { num: '01', title: '대학 정체성 회복(연구), 환경 교육', icon: BookOpen },
      { num: '02', title: '교내외 환경 협력 네트워크 구축', icon: Network },
      { num: '03', title: '지역사회 환경캠페인 활동', icon: Megaphone },
      { num: '04', title: '국내 환경보호기관 협력활동', icon: Link2 },
      { num: '05', title: '그린캠퍼스 구현', icon: Building2 },
      { num: '06', title: 'ECO-Farm 육성 전략 추진', icon: Sprout },
      { num: '07', title: '숲 생태교육 프로그램 운영', icon: TreePine },
      { num: '08', title: '노작교육', icon: Recycle },
      { num: '09', title: '환경관련 교과목 개설 및 운영', icon: GraduationCap },
      { num: '10', title: '문서중앙화', icon: FileText },
    ],
    sdaValues: [
      {
        title: '하나님과 가까워짐',
        titleEn: 'Fostering friendship with God',
        description:
          '하나님의 창조과정에서 인간에게 주어진 문화명령(창1:28)을 실천함에 있어서 성경의 기본적 가치인 생명을 존중하고 환경을 보호함으로 하나님과의 관계 회복',
        icon: Heart,
      },
      {
        title: '전인교육',
        titleEn: 'Whole-person development',
        description:
          'ECO-Farm, 숲 생태 교육, 노작교육 등을 통해 지·영·체의 균형잡힌 발달을 도모하는 전인교육 실천',
        icon: BookOpenCheck,
      },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    labelKr: '사회',
    direction: '사회적 가치 실현',
    color: '#3b82f6',
    bgColor: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: Users,
    items: [
      { num: '01', title: '참여·봉사 연계 교과 강화', icon: Heart },
      { num: '02', title: '교내 사회혁신 생태계 구축', icon: Lightbulb },
      { num: '03', title: '차별금지 및 다양성 존중', icon: UserCheck },
      { num: '04', title: '개인정보 보호 관련 교육', icon: Shield },
      { num: '05', title: '서비스러닝 교과목 개발', icon: GraduationCap },
      { num: '06', title: '캡스톤 디자인 활성화', icon: FlaskConical },
      { num: '07', title: '신사업 활성화 차원의 리빙랩 지원', icon: Building2 },
      { num: '08', title: '지역사회 프로그램 개발', icon: Globe2 },
      { num: '09', title: '지역사회 공유 협력(공유대학 포함)', icon: Link2 },
      { num: '10', title: '평생교육 프로그램 개발', icon: BookOpen },
    ],
    sdaValues: [
      {
        title: '이타적 봉사',
        titleEn: 'Selfless service',
        description:
          '참여·봉사 연계 교과 강화, 서비스러닝 교과목 개발, 캡스톤 디자인 활성화, 리빙랩 지원 등을 통한 사회공헌 가치 구현',
        icon: Heart,
      },
      {
        title: '학생의 행복한 삶',
        titleEn: 'A useful and joy-filled life',
        description:
          '교육 효과성이 높은 경험기반 교육 등을 통해 학생들의 다양한 경험과 체험 기회 제공 및 미래 지도자로 육성',
        icon: Smile,
      },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    labelKr: '거버넌스',
    direction: '투명하고 윤리적인 책임경영',
    color: '#8b5cf6',
    bgColor: 'from-violet-500 to-violet-600',
    lightBg: 'bg-violet-50',
    border: 'border-violet-200',
    textColor: 'text-violet-700',
    icon: Shield,
    items: [
      { num: '01', title: '교내 ESG 플랫폼 구축', icon: Target },
      { num: '02', title: '국내외 사회공헌 거점 구축', icon: Globe2 },
      { num: '03', title: 'ESG 기반 대학경영 실현', icon: Landmark },
      { num: '04', title: '업무 투명성(소통) 및 책임 강화', icon: Eye },
      { num: '05', title: '교직원 및 학생 경영 참여', icon: Users },
      { num: '06', title: '내부감사 부서 설치', icon: Scale },
      { num: '07', title: '회계 투명성 관리 체계 운영', icon: Wallet },
      { num: '08', title: '수익사업 개발 및 확대', icon: TrendingUp },
      { num: '09', title: '예산관리 시스템 고도화', icon: BarChart3 },
      { num: '10', title: '성과관리 시스템 개발 및 운영', icon: Award },
    ],
    sdaValues: [
      {
        title: '성경기반 가치',
        titleEn: 'Bible-based values',
        description:
          '성경 기반 ESG 가치를 대학경영 전반에 적용함으로써 배려와 환대, 존중의 삼육대학교 공동체 구현',
        icon: BookOpenCheck,
      },
    ],
  },
];

// ─── 컴포넌트 ───

export default function StrategyPage() {
  const [activeTab, setActiveTab] = useState('environment');

  const activePillar = strategyPillars.find((p) => p.id === activeTab)!;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 left-20 w-72 h-72 rounded-full blur-[120px]"
            style={{ backgroundColor: activePillar.color }}
          />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-violet-500 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            메인으로 돌아가기
          </a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium border border-white/10">
                <Leaf className="w-3.5 h-3.5" />
                ESG Strategy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
              ESG 경영전략과
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                신앙적 가치 연계
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              대학설립이념 및 교육철학을 기반으로
              <br className="hidden md:block" />
              ESG 경영전략을 체계적으로 수립하고 실천합니다.
            </p>
          </motion.div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {strategyPillars.map((pillar, i) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => setActiveTab(pillar.id)}
                className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 ${
                  activeTab === pillar.id
                    ? 'bg-white/15 border-white/30 shadow-lg scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${pillar.color}30` }}
                  >
                    <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{pillar.label}</p>
                    <p className="text-white font-bold">{pillar.labelKr}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{pillar.direction}</p>
                <div className="mt-3 text-xs text-gray-500">
                  실행과제 {pillar.items.length}개 · 신앙적 가치 {pillar.sdaValues.length}개
                </div>
                {activeTab === pillar.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                    style={{ backgroundColor: pillar.color }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${activePillar.color}15` }}
              >
                <activePillar.icon
                  className="w-7 h-7"
                  style={{ color: activePillar.color }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activePillar.labelKr} ({activePillar.label})
                </h2>
                <p className="text-gray-500">{activePillar.direction}</p>
              </div>
            </div>

            {/* 전략방향 & 실행과제 */}
            <div className="mb-16">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                전략방향 · 실행과제
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePillar.items.map((item, i) => (
                  <motion.div
                    key={item.num}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-4 p-5 rounded-2xl ${activePillar.lightBg} border ${activePillar.border} hover:shadow-md transition-shadow`}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{
                        backgroundColor: `${activePillar.color}20`,
                        color: activePillar.color,
                      }}
                    >
                      {item.num}
                    </div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <item.icon
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: activePillar.color, opacity: 0.6 }}
                      />
                      <p className={`font-medium ${activePillar.textColor} leading-snug`}>
                        {item.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 신앙적 가치 연계 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                신앙적 가치 연계
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activePillar.sdaValues.map((val, i) => (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8"
                  >
                    <div
                      className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-20"
                      style={{ backgroundColor: activePillar.color }}
                    />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${activePillar.color}30` }}
                        >
                          <val.icon className="w-5 h-5" style={{ color: activePillar.color }} />
                        </div>
                        <div>
                          <p className="font-bold text-white">{val.title}</p>
                          <p className="text-xs text-gray-400">{val.titleEn}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 참고문헌 */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-xs text-gray-400 text-center">
            참고문헌 : Adventist Accrediting Association ACCREDITATION HANDBOOK 2019
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="삼육대학교" className="h-8 w-auto bg-white rounded-full p-0.5" />
              <span className="font-bold text-gray-900">ESG아카이브</span>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} 삼육대학교 ESG아카이브. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
