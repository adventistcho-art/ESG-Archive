'use client';

import { useState } from 'react';
import { X, Plus, Upload, FileText } from 'lucide-react';
import { PerformanceProposal, PerformanceManager, EvidenceDocument } from '@/lib/types';

interface ProposalFormProps {
  onSubmit: (data: Partial<PerformanceProposal>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PerformanceProposal>;
}

export default function ProposalForm({ onSubmit, onCancel, initialData }: ProposalFormProps) {
  const [formData, setFormData] = useState<Partial<PerformanceProposal>>({
    title: initialData?.title || '',
    overview: initialData?.overview || {
      description: '',
      projectName: '',
      futureActivities: '',
    },
    resolution: initialData?.resolution || {
      resolution: '',
    },
    managers: initialData?.managers || [],
    evidenceDocuments: initialData?.evidenceDocuments || [],
    attachments: initialData?.attachments || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 성과담당자 추가
  const addManager = () => {
    setFormData({
      ...formData,
      managers: [
        ...(formData.managers || []),
        { dept: '', position: '', name: '', period: '', content: '' },
      ],
    });
  };

  // 성과담당자 삭제
  const removeManager = (index: number) => {
    setFormData({
      ...formData,
      managers: formData.managers?.filter((_, i) => i !== index) || [],
    });
  };

  // 성과담당자 업데이트
  const updateManager = (index: number, field: keyof PerformanceManager, value: string) => {
    const newManagers = [...(formData.managers || [])];
    newManagers[index] = { ...newManagers[index], [field]: value };
    setFormData({ ...formData, managers: newManagers });
  };

  // 증빙자료 추가
  const addEvidence = () => {
    setFormData({
      ...formData,
      evidenceDocuments: [
        ...(formData.evidenceDocuments || []),
        { year: '', title: '', workPlan: '' },
      ],
    });
  };

  // 증빙자료 삭제
  const removeEvidence = (index: number) => {
    setFormData({
      ...formData,
      evidenceDocuments: formData.evidenceDocuments?.filter((_, i) => i !== index) || [],
    });
  };

  // 증빙자료 업데이트
  const updateEvidence = (index: number, field: keyof EvidenceDocument, value: string) => {
    const newEvidences = [...(formData.evidenceDocuments || [])];
    newEvidences[index] = { ...newEvidences[index], [field]: value };
    setFormData({ ...formData, evidenceDocuments: newEvidences });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">성과상여금심사위원회 안건</h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 안건 제목 */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          안건 제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="예: 000사업(부서명)성과상여금심사위원회 안건"
        />
      </div>

      {/* 성과 개요 */}
      <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-1 h-6 bg-emerald-500 rounded"></div>
          성과 개요 (참여의 개요 및 기대효과 작성, 표/그림 삽입가능)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              미래교육혁신을 위해 정부는... <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.overview?.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overview: { ...formData.overview!, description: e.target.value },
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="정부 정책이나 사업 배경을 설명해주세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이를 위해 000는 000사업을 수주, 000 등의 성과를 세움 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.overview?.projectName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overview: { ...formData.overview!, projectName: e.target.value },
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="프로젝트명과 주요 성과를 작성해주세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              향후 이를 통해 000, 000 등의 활동... <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.overview?.futureActivities}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overview: { ...formData.overview!, futureActivities: e.target.value },
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="향후 활동 계획을 작성해주세요"
            />
          </div>
        </div>
      </div>

      {/* 사업결의번호 */}
      <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-1 h-6 bg-emerald-500 rounded"></div>
          사업결의번호: 행정위00-00, 000사업 추진
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            결의번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.resolution?.resolution}
            onChange={(e) =>
              setFormData({
                ...formData,
                resolution: { resolution: e.target.value },
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="예: 행정위23-05, ESG혁신사업 추진"
          />
        </div>
      </div>

      {/* 성과담당자 */}
      <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-500 rounded"></div>
            성과담당자 (사업결의에 포함된 인원 해당)
          </h3>
          <button
            type="button"
            onClick={addManager}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            담당자 추가
          </button>
        </div>

        <div className="space-y-4">
          {formData.managers?.map((manager, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">담당자 {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeManager(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">부서명</label>
                  <input
                    type="text"
                    required
                    value={manager.dept}
                    onChange={(e) => updateManager(index, 'dept', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="예: 기획부서"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">직책</label>
                  <input
                    type="text"
                    required
                    value={manager.position}
                    onChange={(e) => updateManager(index, 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="예: 팀장"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">성명</label>
                  <input
                    type="text"
                    required
                    value={manager.name}
                    onChange={(e) => updateManager(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="예: 김삼육"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">업무기간</label>
                  <input
                    type="text"
                    required
                    value={manager.period}
                    onChange={(e) => updateManager(index, 'period', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="예: 2023.3.5~8.10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">참여내용</label>
                <textarea
                  rows={2}
                  value={manager.content}
                  onChange={(e) => updateManager(index, 'content', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="담당 업무 및 참여 내용을 간단히 작성해주세요"
                />
              </div>
            </div>
          ))}

          {(!formData.managers || formData.managers.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>등록된 담당자가 없습니다. 담당자를 추가해주세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* 증빙자료 목록 */}
      <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-500 rounded"></div>
            증빙자료 목록 (사업결의록(인건위유사)를 비롯한 성과를 증빙할 수 있는 공문 및 보고서 첨부)
          </h3>
          <button
            type="button"
            onClick={addEvidence}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            자료 추가
          </button>
        </div>

        <div className="space-y-3">
          {formData.evidenceDocuments?.map((evidence, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">증빙자료 {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeEvidence(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연번</label>
                  <input
                    type="text"
                    required
                    value={evidence.year}
                    onChange={(e) => updateEvidence(index, 'year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="예: 예시)1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                  <input
                    type="text"
                    required
                    value={evidence.title}
                    onChange={(e) => updateEvidence(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="증빙자료 제목"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">과업명</label>
                  <input
                    type="text"
                    required
                    value={evidence.workPlan}
                    onChange={(e) => updateEvidence(index, 'workPlan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="예: 행정위원회 회의록(2023-00) 또는 (불입)000사업 협약서(참육대-과기정통부)"
                  />
                </div>
              </div>
            </div>
          ))}

          {(!formData.evidenceDocuments || formData.evidenceDocuments.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>등록된 증빙자료가 없습니다. 자료를 추가해주세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* 파일 첨부 안내 */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">첨부 파일 안내</p>
            <p>실제 파일 업로드 기능은 백엔드 구현 후 추가됩니다. 현재는 증빙자료 목록만 작성해주세요.</p>
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '제출 중...' : '안건 제출'}
        </button>
      </div>
    </form>
  );
}
