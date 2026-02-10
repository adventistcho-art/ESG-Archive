'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  BarChart3,
  FileText,
  Search,
  ChevronLeft,
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  FolderKanban,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { adminAPI, plansAPI } from '@/lib/api';
import { EsgProject, EsgPlan } from '@/lib/types';
import { getCategoryLabel, getCategoryColor, getCategoryKorean, formatBudget } from '@/lib/utils';
import ProjectForm from '@/components/ProjectForm';
import ResultForm from '@/components/ResultForm';
import PlanForm from '@/components/PlanForm';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, loadFromStorage } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'projects' | 'plans'>('projects');
  
  // Projects state
  const [projects, setProjects] = useState<EsgProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<EsgProject | null>(null);
  const [showResultForm, setShowResultForm] = useState(false);
  const [resultProject, setResultProject] = useState<EsgProject | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  // Plans state
  const [plans, setPlans] = useState<EsgPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<EsgPlan | null>(null);
  const [planSearchQuery, setPlanSearchQuery] = useState('');

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  const loadProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      const data = await adminAPI.getProjects();
      setProjects(data);
    } catch (e) {
      console.error('Failed to load projects', e);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      setLoadingPlans(true);
      const data = await plansAPI.getAll();
      setPlans(data);
    } catch (e) {
      console.error('Failed to load plans', e);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
      loadPlans();
    }
  }, [isAuthenticated, loadProjects, loadPlans]);

  const handleDeleteProject = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await adminAPI.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e.message || '삭제 실패');
    }
  };

  const handleTogglePublish = async (project: EsgProject) => {
    try {
      await adminAPI.updateProject(project.id, {
        isPublished: !project.isPublished,
      });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, isPublished: !p.isPublished } : p
        )
      );
    } catch (e: any) {
      alert(e.message || '변경 실패');
    }
  };

  const handleProjectFormSuccess = () => {
    setShowProjectForm(false);
    setEditingProject(null);
    loadProjects();
  };

  const handleResultFormSuccess = () => {
    setShowResultForm(false);
    setResultProject(null);
    if (resultProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === resultProject.id ? { ...p, hasResult: true } : p
        )
      );
    }
  };

  const handlePlanFormSuccess = () => {
    setShowPlanForm(false);
    setEditingPlan(null);
    loadPlans();
  };

  const handleDeletePlan = (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.deptName.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.task.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  const filteredPlans = plans.filter(
    (p) =>
      p.title.toLowerCase().includes(planSearchQuery.toLowerCase()) ||
      p.deptName.toLowerCase().includes(planSearchQuery.toLowerCase())
  );

  const projectStats = {
    total: projects.length,
    published: projects.filter((p) => p.isPublished).length,
    draft: projects.filter((p) => !p.isPublished).length,
  };

  const planStats = {
    total: plans.length,
    planned: plans.filter((p) => p.status === 'PLANNED').length,
    inProgress: plans.filter((p) => p.status === 'IN_PROGRESS').length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="삼육대학교" className="h-8 w-auto" />
                <span className="font-bold text-gray-900">ESG아카이브</span>
              </a>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-gray-500">
                관리자 대시보드
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.deptName}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back to main */}
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          메인 페이지로
        </a>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            프로젝트 관리
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'plans'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            계획 관리
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-400">전체 프로젝트</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{projectStats.total}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-400">공개됨</span>
                </div>
                <p className="text-3xl font-bold text-emerald-600">
                  {projectStats.published}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-sm text-gray-400">임시저장</span>
                </div>
                <p className="text-3xl font-bold text-amber-600">{projectStats.draft}</p>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  placeholder="프로젝트 검색..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditingProject(null);
                  setShowProjectForm(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                새 프로젝트
              </motion.button>
            </div>

            {/* Project List */}
            {loadingProjects ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">프로젝트가 없습니다</p>
                <p className="text-gray-300 text-sm">
                  새 프로젝트를 생성하여 ESG 성과를 기록하세요
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm p-5 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div
                            className="w-1 h-12 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                project.category === 'ENVIRONMENT'
                                  ? '#10b981'
                                  : project.category === 'SOCIAL'
                                  ? '#3b82f6'
                                  : '#8b5cf6',
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(
                                  project.category
                                )} border`}
                              >
                                {getCategoryKorean(project.category)}
                              </span>
                              <span className="text-xs text-gray-400">
                                {project.year}
                              </span>
                              {project.isPublished ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-xs font-medium">
                                  <Eye className="w-3 h-3" /> 공개
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs font-medium">
                                  <EyeOff className="w-3 h-3" /> 비공개
                                </span>
                              )}
                              {project.hasResult && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium">
                                  <CheckCircle2 className="w-3 h-3" /> 결과등록
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {project.title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {project.deptName} · {project.task}
                              {project.budget
                                ? ` · ${formatBudget(project.budget)}`
                                : ''}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              setResultProject(project);
                              setShowResultForm(true);
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="결과 등록"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePublish(project)}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            title={
                              project.isPublished ? '비공개로 전환' : '공개로 전환'
                            }
                          >
                            {project.isPublished ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setShowProjectForm(true);
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="수정"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-400">전체 계획</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{planStats.total}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-400">계획 수립</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {planStats.planned}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-violet-600" />
                  </div>
                  <span className="text-sm text-gray-400">진행중</span>
                </div>
                <p className="text-3xl font-bold text-violet-600">{planStats.inProgress}</p>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={planSearchQuery}
                  onChange={(e) => setPlanSearchQuery(e.target.value)}
                  placeholder="계획 검색..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditingPlan(null);
                  setShowPlanForm(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                새 계획
              </motion.button>
            </div>

            {/* Plan List */}
            {loadingPlans ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 h-32 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">계획이 없습니다</p>
                <p className="text-gray-300 text-sm">
                  새 계획을 등록하여 ESG 전략을 수립하세요
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredPlans.map((plan, index) => {
                    const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
                      PLANNED: { color: 'text-gray-600', bg: 'bg-gray-100', label: '계획' },
                      IN_PROGRESS: { color: 'text-blue-600', bg: 'bg-blue-50', label: '진행중' },
                      COMPLETED: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: '완료' },
                    };
                    const status = statusConfig[plan.status] || statusConfig.PLANNED;

                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm p-5 transition-all"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-xs font-medium text-gray-400">
                                {plan.year}년
                              </span>
                              <span className="text-gray-200">·</span>
                              <span className="text-xs text-gray-400">{plan.deptName}</span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.color}`}
                              >
                                {status.label}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {plan.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                              {plan.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>목표 {plan.goals.length}개</span>
                              <span>KPI {plan.kpiTargets.length}개</span>
                              {plan.budget && <span>{formatBudget(plan.budget)}</span>}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingPlan(plan);
                                setShowPlanForm(true);
                              }}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="수정"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showProjectForm && (
          <ProjectForm
            project={editingProject}
            onClose={() => {
              setShowProjectForm(false);
              setEditingProject(null);
            }}
            onSuccess={handleProjectFormSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResultForm && resultProject && (
          <ResultForm
            project={resultProject}
            onClose={() => {
              setShowResultForm(false);
              setResultProject(null);
            }}
            onSuccess={handleResultFormSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPlanForm && (
          <PlanForm
            plan={editingPlan}
            onClose={() => {
              setShowPlanForm(false);
              setEditingPlan(null);
            }}
            onSuccess={handlePlanFormSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
