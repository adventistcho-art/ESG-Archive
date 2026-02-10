'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Leaf,
  Users,
  Shield,
  ChevronLeft,
  BookOpen,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Wallet,
  FileText,
  Target,
} from 'lucide-react';
import Header from '@/components/Header';
import { whitePaperAPI } from '@/lib/api';
import { EsgWhitePaper, CategorySummary } from '@/lib/types';
import { formatBudget } from '@/lib/utils';

const categoryConfig = {
  environment: { label: 'Environment', labelKr: '환경', color: '#10b981', icon: Leaf },
  social: { label: 'Social', labelKr: '사회', color: '#3b82f6', icon: Users },
  governance: { label: 'Governance', labelKr: '거버넌스', color: '#8b5cf6', icon: Shield },
};

export default function WhitePaperPage() {
  const [whitePapers, setWhitePapers] = useState<EsgWhitePaper[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWhitePapers();
  }, []);

  const loadWhitePapers = async () => {
    try {
      const data = await whitePaperAPI.getAll();
      setWhitePapers(data);
      if (data.length > 0) setSelectedYear(data[0].year);
    } catch (e) {
      console.error('Failed to load white papers', e);
    } finally {
      setLoading(false);
    }
  };

  const activeWP = whitePapers.find((w) => w.year === selectedYear);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-amber-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-emerald-500 rounded-full blur-[120px]" />
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium border border-amber-500/20">
                <BookOpen className="w-3.5 h-3.5" />
                ESG White Paper
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
              ESG 경영 백서
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              연도별 ESG 운영 결과를 체계적으로 정리한
              <br className="hidden md:block" />
              대학 ESG 경영 성과 보고서입니다.
            </p>
          </motion.div>

          {/* Year Tabs */}
          <div className="flex gap-3 mt-10">
            {whitePapers.map((wp) => (
              <motion.button
                key={wp.year}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedYear(wp.year)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedYear === wp.year
                    ? 'bg-white text-gray-900 shadow-xl'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                }`}
              >
                {wp.year}년 백서
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
            ))}
          </div>
        </div>
      ) : activeWP ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Overview */}
            <section className="max-w-7xl mx-auto px-6 py-16">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeWP.title}</h2>
                <p className="text-gray-500 leading-relaxed max-w-4xl">
                  {activeWP.overview}
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-400">총 프로젝트</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{activeWP.totalProjects}</p>
                  <p className="text-xs text-gray-400 mt-1">개 프로젝트</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-400">총 예산</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatBudget(activeWP.totalBudget)}</p>
                  <p className="text-xs text-gray-400 mt-1">집행</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-gray-400">완료율</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">100%</p>
                  <p className="text-xs text-gray-400 mt-1">전 프로젝트 완료</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-400">주요 성과</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{activeWP.highlights.length}</p>
                  <p className="text-xs text-gray-400 mt-1">개 핵심 성과</p>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-16">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                  주요 성과 요약
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeWP.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-700">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Category Summaries */}
              {[
                { key: 'environment', summary: activeWP.environmentSummary },
                { key: 'social', summary: activeWP.socialSummary },
                { key: 'governance', summary: activeWP.governanceSummary },
              ].map(({ key, summary }, sectionIndex) => {
                const config = categoryConfig[key as keyof typeof categoryConfig];
                return (
                  <div key={key} className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}15` }}
                      >
                        <config.icon className="w-7 h-7" style={{ color: config.color }} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {config.labelKr} ({config.label})
                        </h3>
                        <p className="text-sm text-gray-400">
                          {summary.totalProjects}개 프로젝트 · {formatBudget(summary.totalBudget)} 집행
                        </p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-400 mb-4">주요 사업</h4>
                      <div className="space-y-2">
                        {summary.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ backgroundColor: `${config.color}08` }}
                          >
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: `${config.color}20`, color: config.color }}
                            >
                              {i + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Results */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-4">핵심 성과</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {summary.keyResults.map((r, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-shadow"
                          >
                            <Target
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: config.color }}
                            />
                            <span className="text-sm text-gray-600">{r}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {sectionIndex < 2 && (
                      <hr className="mt-12 border-gray-100" />
                    )}
                  </div>
                );
              })}
            </section>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">백서 데이터가 없습니다.</p>
        </div>
      )}

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
