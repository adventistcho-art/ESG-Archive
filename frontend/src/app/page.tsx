'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Leaf, Users, Shield, ArrowRight, BookOpen, Sprout, Heart, Lightbulb, Target, Landmark } from 'lucide-react';
import { projectsAPI } from '@/lib/api';
import { EsgProject, EsgType } from '@/lib/types';
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';

const categories: { value: EsgType | 'ALL'; label: string; icon: any; color: string }[] = [
  { value: 'ALL', label: '전체', icon: null, color: 'bg-gray-900 text-white' },
  { value: 'ENVIRONMENT', label: 'Environment', icon: Leaf, color: 'bg-emerald-500 text-white' },
  { value: 'SOCIAL', label: 'Social', icon: Users, color: 'bg-blue-500 text-white' },
  { value: 'GOVERNANCE', label: 'Governance', icon: Shield, color: 'bg-violet-500 text-white' },
];

const strategyPillars = [
  {
    label: 'Environment',
    labelKr: '환경',
    direction: '친환경/에너지 절약 생활화',
    color: '#10b981',
    icon: Leaf,
    highlights: ['그린캠퍼스 구현', 'ECO-Farm 육성 전략 추진', '숲 생태교육 프로그램 운영'],
  },
  {
    label: 'Social',
    labelKr: '사회',
    direction: '사회적 가치 실현',
    color: '#3b82f6',
    icon: Users,
    highlights: ['서비스러닝 교과목 개발', '캡스톤 디자인 활성화', '지역사회 공유 협력'],
  },
  {
    label: 'Governance',
    labelKr: '거버넌스',
    direction: '투명하고 윤리적인 책임경영',
    color: '#8b5cf6',
    icon: Shield,
    highlights: ['ESG 플랫폼 구축', '회계 투명성 관리 체계', '성과관리 시스템 운영'],
  },
];

export default function HomePage() {
  const [projects, setProjects] = useState<EsgProject[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EsgType | 'ALL'>('ALL');
  const [selectedProject, setSelectedProject] = useState<EsgProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [selectedYear, selectedCategory]);

  const loadYears = async () => {
    try {
      const yrs = await projectsAPI.getYears();
      setYears(yrs);
      if (yrs.length > 0) setSelectedYear(yrs[0]);
    } catch (e) {
      setYears([2025, 2024]);
      setSelectedYear(2025);
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const filter: any = {};
      if (selectedYear) filter.year = selectedYear;
      if (selectedCategory !== 'ALL') filter.category = selectedCategory;
      const data = await projectsAPI.getAll(filter);
      setProjects(data);
    } catch (e) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ESG 경영전략 - 메인 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-violet-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                ESG 경영전략
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              대학의 환경(E)·사회(S)·거버넌스(G) 경영전략을 체계적으로 수립하고,
              <br className="hidden md:block" />
              투명하게 공개하는 디지털 백서 시스템입니다.
            </p>
          </motion.div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {strategyPillars.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${pillar.color}25` }}
                  >
                    <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{pillar.label}</p>
                    <p className="text-white font-bold text-lg">{pillar.labelKr}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">{pillar.direction}</p>
                <div className="space-y-2">
                  {pillar.highlights.map((h, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: pillar.color }}
                      />
                      <span className="text-sm text-gray-300">{h}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">외 7개 실행과제</p>
              </motion.div>
            ))}
          </div>

          {/* 전략 상세 보기 버튼 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Link
              href="/strategy"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              전략 상세 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Archive Section */}
      <section id="archive" className="max-w-7xl mx-auto px-6 py-20">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              <BookOpen className="w-3 h-3" />
              Archive
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">ESG 성과 아카이브</h2>
          <p className="text-gray-400">연도별·영역별 ESG 실행 성과를 확인하세요</p>
        </div>

        {/* Year Tabs */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Year
          </h3>
          <div className="flex gap-2 flex-wrap">
            {years.map((year) => (
              <motion.button
                key={year}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedYear(year)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedYear === year
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {year}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Category
          </h3>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? cat.color + ' shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon && <cat.icon className="w-4 h-4" />}
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Project Count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-500">
            <span className="text-gray-900 font-semibold">{filteredProjects.length}</span>개의
            프로젝트
          </p>
        </div>

        {/* Project Card Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-100 animate-pulse h-[380px]"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">
              해당 조건에 맞는 프로젝트가 없습니다.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
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

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
