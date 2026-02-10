'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  TrendingUp,
  FileText,
  Calendar,
} from 'lucide-react';
import { resultsAPI } from '@/lib/api';
import { EsgProject, ProjectResult } from '@/lib/types';

interface ResultFormProps {
  project: EsgProject;
  existingResult?: ProjectResult | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ResultForm({ project, existingResult, onClose, onSuccess }: ResultFormProps) {
  const isEditing = !!existingResult;

  const [formData, setFormData] = useState({
    summary: existingResult?.summary || '',
    achievement: existingResult?.achievement || '',
    quantitativeResult: existingResult?.quantitativeResult || '',
    qualitativeResult: existingResult?.qualitativeResult || '',
    budgetUsed: existingResult?.budgetUsed || undefined as number | undefined,
    issues: existingResult?.issues || '',
    nextSteps: existingResult?.nextSteps || '',
    completedAt: existingResult?.completedAt
      ? new Date(existingResult.completedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.summary.trim()) {
      setError('결과 요약을 입력해주세요.');
      return;
    }
    if (!formData.qualitativeResult.trim()) {
      setError('정성적 결과를 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        budgetUsed: formData.budgetUsed ? Number(formData.budgetUsed) : null,
        completedAt: new Date(formData.completedAt).toISOString(),
        images: [],
        documents: [],
      };

      if (isEditing) {
        await resultsAPI.update(project.id, submitData);
      } else {
        await resultsAPI.create(project.id, submitData);
      }

      onSuccess();
    } catch (e: any) {
      setError(e.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const categoryColor =
    project.category === 'ENVIRONMENT'
      ? '#10b981'
      : project.category === 'SOCIAL'
      ? '#3b82f6'
      : '#8b5cf6';

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
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 bg-white rounded-t-3xl border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? '결과 수정' : '결과 등록'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: categoryColor }}
              />
              {project.title}
            </p>
          </div>
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

          {/* 결과 요약 */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              <ClipboardCheck className="w-4 h-4" />
              결과 요약
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  결과 요약 *
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  placeholder="프로젝트 결과를 한 문단으로 요약해주세요..."
                  rows={3}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  주요 성과 *
                </label>
                <textarea
                  value={formData.achievement}
                  onChange={(e) => handleChange('achievement', e.target.value)}
                  placeholder="핵심 성과를 기술해주세요..."
                  rows={3}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    완료일 *
                  </label>
                  <input
                    type="date"
                    value={formData.completedAt}
                    onChange={(e) => handleChange('completedAt', e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    실제 집행 예산 (원)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetUsed || ''}
                    onChange={(e) =>
                      handleChange(
                        'budgetUsed',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="예: 150000000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 성과 데이터 */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              <TrendingUp className="w-4 h-4" />
              성과 데이터
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  정량적 결과
                </label>
                <input
                  type="text"
                  value={formData.quantitativeResult}
                  onChange={(e) => handleChange('quantitativeResult', e.target.value)}
                  placeholder="예: 탄소 배출량 12% 감축, 참여 학생 120명"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  정성적 결과 *
                </label>
                <textarea
                  value={formData.qualitativeResult}
                  onChange={(e) => handleChange('qualitativeResult', e.target.value)}
                  placeholder="추진 목표 대비 달성 내용을 상세히 기술해주세요..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </section>

          {/* 이슈 및 향후 계획 */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              <FileText className="w-4 h-4" />
              이슈 및 향후 계획
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  이슈 및 문제점
                </label>
                <textarea
                  value={formData.issues}
                  onChange={(e) => handleChange('issues', e.target.value)}
                  placeholder="사업 수행 중 발생한 이슈나 문제점을 기술해주세요..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  향후 계획
                </label>
                <textarea
                  value={formData.nextSteps}
                  onChange={(e) => handleChange('nextSteps', e.target.value)}
                  placeholder="향후 계획 및 개선 방안을 기술해주세요..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
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
              className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: categoryColor }}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {isEditing ? '결과 수정' : '결과 등록'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
