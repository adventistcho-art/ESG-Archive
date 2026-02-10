'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertCircle, Calendar, Target, Wallet, Clock, Plus, Trash2 } from 'lucide-react';
import { EsgType, EsgPlan, KpiTarget } from '@/lib/types';
import { Leaf, Users, Shield } from 'lucide-react';

interface PlanFormProps {
  plan?: EsgPlan | null;
  onClose: () => void;
  onSuccess: () => void;
}

const categoryOptions: { value: EsgType; label: string; icon: any; color: string }[] = [
  { value: 'ENVIRONMENT', label: '환경 (E)', icon: Leaf, color: 'emerald' },
  { value: 'SOCIAL', label: '사회 (S)', icon: Users, color: 'blue' },
  { value: 'GOVERNANCE', label: '거버넌스 (G)', icon: Shield, color: 'violet' },
];

export default function PlanForm({ plan, onClose, onSuccess }: PlanFormProps) {
  const isEditing = !!plan;

  const [formData, setFormData] = useState({
    year: plan?.year || new Date().getFullYear() + 1,
    category: (plan?.category || 'ENVIRONMENT') as EsgType,
    title: plan?.title || '',
    description: plan?.description || '',
    deptName: plan?.deptName || '',
    task: plan?.task || '',
    goals: plan?.goals || [''],
    kpiTargets: plan?.kpiTargets || [{ name: '', target: '', unit: '' }],
    budget: plan?.budget || undefined as number | undefined,
    timeline: plan?.timeline || '',
    status: plan?.status || 'PLANNED',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    handleChange('goals', newGoals);
  };

  const addGoal = () => {
    handleChange('goals', [...formData.goals, '']);
  };

  const removeGoal = (index: number) => {
    if (formData.goals.length > 1) {
      handleChange('goals', formData.goals.filter((_, i) => i !== index));
    }
  };

  const handleKpiChange = (index: number, field: keyof KpiTarget, value: string) => {
    const newKpis = [...formData.kpiTargets];
    newKpis[index] = { ...newKpis[index], [field]: value };
    handleChange('kpiTargets', newKpis);
  };

  const addKpi = () => {
    handleChange('kpiTargets', [...formData.kpiTargets, { name: '', target: '', unit: '' }]);
  };

  const removeKpi = (index: number) => {
    if (formData.kpiTargets.length > 1) {
      handleChange('kpiTargets', formData.kpiTargets.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('계획명을 입력해주세요.');
      return;
    }
    if (!formData.description.trim()) {
      setError('계획 설명을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      // Mock submission - 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSuccess();
    } catch (e: any) {
      setError(e.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const categoryColor = categoryOptions.find((c) => c.value === formData.category)?.color || 'emerald';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 bg-white rounded-t-3xl border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? '계획 수정' : '새 계획 등록'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Basic Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              기본 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  계획 연도 *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleChange('year', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  {[2027, 2026, 2025, 2024].map((y) => (
                    <option key={y} value={y}>
                      {y}년
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  담당 부서 *
                </label>
                <input
                  type="text"
                  value={formData.deptName}
                  onChange={(e) => handleChange('deptName', e.target.value)}
                  placeholder="예: 기획처"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ESG 카테고리 *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleChange('category', cat.value)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      formData.category === cat.value
                        ? cat.color === 'emerald'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : cat.color === 'blue'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                계획명 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="예: 탄소중립 캠퍼스 2단계 추진"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                계획 설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="계획의 목적과 배경을 설명해주세요..."
                rows={3}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ESG 실행과제
              </label>
              <input
                type="text"
                value={formData.task}
                onChange={(e) => handleChange('task', e.target.value)}
                placeholder="예: 탄소중립 추진"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </section>

          {/* Goals */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                목표
              </h3>
              <button
                type="button"
                onClick={addGoal}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> 목표 추가
              </button>
            </div>
            <div className="space-y-3">
              {formData.goals.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    placeholder={`목표 ${index + 1}`}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                  {formData.goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* KPI Targets */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                KPI 목표
              </h3>
              <button
                type="button"
                onClick={addKpi}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> KPI 추가
              </button>
            </div>
            <div className="space-y-3">
              {formData.kpiTargets.map((kpi, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={kpi.name}
                    onChange={(e) => handleKpiChange(index, 'name', e.target.value)}
                    placeholder="KPI 항목명"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={kpi.target}
                    onChange={(e) => handleKpiChange(index, 'target', e.target.value)}
                    placeholder="목표값"
                    className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={kpi.unit}
                    onChange={(e) => handleKpiChange(index, 'unit', e.target.value)}
                    placeholder="단위"
                    className="w-20 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                  {formData.kpiTargets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKpi(index)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Timeline & Budget */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              일정 및 예산
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  추진 일정
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => handleChange('timeline', e.target.value)}
                  placeholder="예: 2026.03 ~ 2026.12"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Wallet className="w-3.5 h-3.5 inline mr-1" />
                  예산 계획 (원)
                </label>
                <input
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) =>
                    handleChange('budget', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="예: 150000000"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                categoryColor === 'emerald'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : categoryColor === 'blue'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditing ? '수정 완료' : '계획 등록'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
