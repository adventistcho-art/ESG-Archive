'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Users,
  Shield,
  ChevronLeft,
  Calendar,
  Target,
  BarChart3,
  Wallet,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  XCircle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import Header from '@/components/Header';
import { plansAPI } from '@/lib/api';
import { EsgPlan, EsgType } from '@/lib/types';
import { formatBudget } from '@/lib/utils';

const categoryConfig: Record<EsgType, { label: string; labelKr: string; color: string; icon: any }> = {
  ENVIRONMENT: { label: 'Environment', labelKr: '환경', color: '#10b981', icon: Leaf },
  SOCIAL: { label: 'Social', labelKr: '사회', color: '#3b82f6', icon: Users },
  GOVERNANCE: { label: 'Governance', labelKr: '거버넌스', color: '#8b5cf6', icon: Shield },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PLANNED: { label: '계획', color: 'text-gray-600', bg: 'bg-gray-100', icon: Circle },
  IN_PROGRESS: { label: '진행중', color: 'text-blue-600', bg: 'bg-blue-50', icon: PlayCircle },
  COMPLETED: { label: '완료', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  CANCELLED: { label: '취소', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
};

export default function PlansPage() {
  const [plans, setPlans] = useState<EsgPlan[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EsgType | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    if (selectedYear) loadPlans();
  }, [selectedYear]);

  const loadYears = async () => {
    try {
      const yrs = await plansAPI.getYears();
      setYears(yrs);
      if (yrs.length > 0) setSelectedYear(yrs[0]);
    } catch (e) {
      setYears([2026, 2025]);
      setSelectedYear(2026);
    }
  };

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await plansAPI.getAll(selectedYear ?? undefined);
      setPlans(data);
    } catch (e) {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = selectedCategory === 'ALL'
    ? plans
    : plans.filter((p) => p.category === selectedCategory);

  const groupedPlans: Record<EsgType, EsgPlan[]> = {
    ENVIRONMENT: filteredPlans.filter((p) => p.category === 'ENVIRONMENT'),
    SOCIAL: filteredPlans.filter((p) => p.category === 'SOCIAL'),
    GOVERNANCE: filteredPlans.filter((p) => p.category === 'GOVERNANCE'),
  };

  const totalBudget = plans.reduce((sum, p) => sum + (p.budget || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-violet-500 rounded-full blur-[120px]" />
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/20">
                <Calendar className="w-3.5 h-3.5" />
                ESG Plan
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
              ESG 경영 계획
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              연도별 ESG 경영 계획과 목표를 확인하고
              <br className="hidden md:block" />
              추진 일정 및 KPI를 한눈에 파악할 수 있습니다.
            </p>
          </motion.div>

          {/* Year Tabs */}
          <div className="flex gap-3 mt-10">
            {years.map((year) => (
              <motion.button
                key={year}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedYear === year
                    ? 'bg-white text-gray-900 shadow-xl'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                }`}
              >
                {year}년 계획
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">총 계획 수</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">총 예산 계획</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatBudget(totalBudget)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-400">완료</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {plans.filter((p) => p.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-2 mb-2">
              <PlayCircle className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-400">진행/계획</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {plans.filter((p) => p.status === 'PLANNED' || p.status === 'IN_PROGRESS').length}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {(Object.keys(categoryConfig) as EsgType[]).map((cat) => {
            const config = categoryConfig[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedCategory === cat ? { backgroundColor: config.color } : {}}
              >
                <config.icon className="w-4 h-4" />
                {config.labelKr}
              </button>
            );
          })}
        </div>
      </section>

      {/* Plans by Category */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-60 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedYear}-${selectedCategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {(Object.keys(groupedPlans) as EsgType[]).map((cat) => {
                const catPlans = groupedPlans[cat];
                if (catPlans.length === 0) return null;
                const config = categoryConfig[cat];

                return (
                  <div key={cat} className="mb-16">
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}15` }}
                      >
                        <config.icon className="w-6 h-6" style={{ color: config.color }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {config.labelKr} ({config.label})
                        </h3>
                        <p className="text-sm text-gray-400">{catPlans.length}개 계획</p>
                      </div>
                    </div>

                    {/* Plan Cards */}
                    <div className="space-y-4">
                      {catPlans.map((plan, i) => {
                        const status = statusConfig[plan.status];
                        return (
                          <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all overflow-hidden"
                          >
                            {/* Top color bar */}
                            <div className="h-1" style={{ backgroundColor: config.color }} />

                            <div className="p-6">
                              {/* Header */}
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="text-xs font-medium text-gray-400">
                                      {plan.deptName}
                                    </span>
                                    <span className="text-gray-200">·</span>
                                    <span className="text-xs text-gray-400">{plan.task}</span>
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.color}`}
                                    >
                                      <status.icon className="w-3 h-3" />
                                      {status.label}
                                    </span>
                                  </div>
                                  <h4 className="text-lg font-bold text-gray-900">{plan.title}</h4>
                                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                                </div>
                              </div>

                              {/* Goals */}
                              <div className="mb-5">
                                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                  목표
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {plan.goals.map((goal, j) => (
                                    <span
                                      key={j}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                                      style={{
                                        backgroundColor: `${config.color}08`,
                                        color: config.color,
                                      }}
                                    >
                                      <Target className="w-3 h-3" />
                                      {goal}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* KPI Targets */}
                              <div className="mb-5">
                                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                  KPI 목표
                                </h5>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {plan.kpiTargets.map((kpi, j) => (
                                    <div
                                      key={j}
                                      className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                                    >
                                      <p className="text-xs text-gray-400 mb-1">{kpi.name}</p>
                                      <p className="text-lg font-bold text-gray-900">
                                        {kpi.target}
                                        <span className="text-sm font-normal text-gray-400 ml-0.5">
                                          {kpi.unit}
                                        </span>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Footer Info */}
                              <div className="flex items-center gap-6 pt-4 border-t border-gray-50 text-xs text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  {plan.timeline}
                                </div>
                                {plan.budget && (
                                  <div className="flex items-center gap-1.5">
                                    <Wallet className="w-3.5 h-3.5" />
                                    {formatBudget(plan.budget)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredPlans.length === 0 && (
                <div className="text-center py-20">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">해당 조건에 맞는 계획이 없습니다.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
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
