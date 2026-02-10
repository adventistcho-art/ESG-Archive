'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  Save,
  AlertCircle,
  Check,
  Leaf,
  Users,
  Shield,
} from 'lucide-react';
import { adminAPI, uploadAPI } from '@/lib/api';
import { EsgProject, EsgType } from '@/lib/types';
import { useAuthStore } from '@/lib/store';

interface ProjectFormProps {
  project: EsgProject | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
  const { user } = useAuthStore();
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    year: project?.year || new Date().getFullYear(),
    deptName: project?.deptName || user?.deptName || '',
    title: project?.title || '',
    category: (project?.category || 'ENVIRONMENT') as EsgType,
    task: project?.task || '',
    thumbnail: project?.thumbnail || '',
    oneLineSummary: project?.oneLineSummary || '',
    hasQuantitative: !!project?.quantitative,
    quantitative: project?.quantitative || '',
    qualitative: project?.qualitative || '',
    budget: project?.budget || undefined,
    images: project?.images || [],
    documents: project?.documents || [],
    isPublished: project?.isPublished || false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);

  const handleChange = (
    field: string,
    value: string | number | boolean | string[] | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image dropzone
  const onDropImages = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploadingImages(true);
      try {
        const result = await uploadAPI.uploadImages(acceptedFiles);
        handleChange('images', [...formData.images, ...result.urls]);
      } catch (e: any) {
        // Fallback: create local preview URLs
        const localUrls = acceptedFiles.map((f) => URL.createObjectURL(f));
        handleChange('images', [...formData.images, ...localUrls]);
      } finally {
        setUploadingImages(false);
      }
    },
    [formData.images]
  );

  // Document dropzone
  const onDropDocs = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploadingDocs(true);
      try {
        for (const file of acceptedFiles) {
          const result = await uploadAPI.uploadDocument(file);
          handleChange('documents', [...formData.documents, result.url]);
        }
      } catch (e: any) {
        const localUrls = acceptedFiles.map((f) => URL.createObjectURL(f));
        handleChange('documents', [...formData.documents, ...localUrls]);
      } finally {
        setUploadingDocs(false);
      }
    },
    [formData.documents]
  );

  const imageDropzone = useDropzone({
    onDrop: onDropImages,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    maxSize: 10 * 1024 * 1024,
  });

  const docDropzone = useDropzone({
    onDrop: onDropDocs,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('사업명을 입력해주세요.');
      return;
    }
    if (!formData.qualitative.trim()) {
      setError('정성적 실적을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      const submitData: any = {
        year: Number(formData.year),
        deptName: formData.deptName,
        title: formData.title,
        category: formData.category,
        task: formData.task,
        thumbnail: formData.thumbnail || undefined,
        oneLineSummary: formData.oneLineSummary || undefined,
        quantitative: formData.hasQuantitative
          ? formData.quantitative
          : undefined,
        qualitative: formData.qualitative,
        budget: formData.budget ? Number(formData.budget) : undefined,
        images: formData.images,
        documents: formData.documents,
        isPublished: formData.isPublished,
      };

      if (isEditing && project) {
        await adminAPI.updateProject(project.id, submitData);
      } else {
        await adminAPI.createProject(submitData);
      }

      onSuccess();
    } catch (e: any) {
      setError(e.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (index: number) => {
    handleChange(
      'images',
      formData.images.filter((_, i) => i !== index)
    );
  };

  const removeDocument = (index: number) => {
    handleChange(
      'documents',
      formData.documents.filter((_, i) => i !== index)
    );
  };

  const categories: { value: EsgType; label: string; icon: any; color: string }[] = [
    { value: 'ENVIRONMENT', label: '환경 (E)', icon: Leaf, color: 'emerald' },
    { value: 'SOCIAL', label: '사회 (S)', icon: Users, color: 'blue' },
    { value: 'GOVERNANCE', label: '거버넌스 (G)', icon: Shield, color: 'violet' },
  ];

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
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? '프로젝트 수정' : '새 프로젝트 등록'}
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
                  사업연도 *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleChange('year', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  {[2026, 2025, 2024, 2023].map((y) => (
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
                  placeholder="예: 아트앤디자인학과"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                세부사업명 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="예: 친환경 캠퍼스 조성 프로젝트"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            {/* Category Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ESG 카테고리 *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
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
                ESG 실행과제 *
              </label>
              <input
                type="text"
                value={formData.task}
                onChange={(e) => handleChange('task', e.target.value)}
                placeholder="예: 탄소중립 캠퍼스 구현"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </section>

          {/* Card Display */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              카드 노출 정보
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  대표 썸네일 URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => handleChange('thumbnail', e.target.value)}
                  placeholder="이미지 URL을 입력하세요"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  한 줄 요약
                </label>
                <input
                  type="text"
                  value={formData.oneLineSummary}
                  onChange={(e) => handleChange('oneLineSummary', e.target.value)}
                  placeholder="카드에 표시될 한 줄 요약"
                  maxLength={100}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* Performance */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              성과 데이터
            </h3>

            {/* Quantitative toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    formData.hasQuantitative
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() =>
                    handleChange('hasQuantitative', !formData.hasQuantitative)
                  }
                >
                  {formData.hasQuantitative && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  정량적 실적 있음
                </span>
              </label>
            </div>

            {formData.hasQuantitative && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  정량적 실적
                </label>
                <input
                  type="text"
                  value={formData.quantitative}
                  onChange={(e) => handleChange('quantitative', e.target.value)}
                  placeholder="예: 태양광 패널 50kW 설치, CO2 감축 120톤"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </motion.div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                정성적 실적 *
              </label>
              <textarea
                value={formData.qualitative}
                onChange={(e) => handleChange('qualitative', e.target.value)}
                placeholder="추진목표 대비 성과를 상세히 기술해주세요..."
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                집행 예산 (원)
              </label>
              <input
                type="number"
                value={formData.budget || ''}
                onChange={(e) =>
                  handleChange(
                    'budget',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="예: 150000000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </section>

          {/* File Upload */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              증빙 자료
            </h3>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활동 사진
              </label>
              <div
                {...imageDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  imageDropzone.isDragActive
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input {...imageDropzone.getInputProps()} />
                {uploadingImages ? (
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    업로드 중...
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      이미지를 드래그하거나 클릭하여 업로드
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, GIF (최대 10MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Image previews */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={img}
                          alt={`${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                증빙 문서 (PDF)
              </label>
              <div
                {...docDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  docDropzone.isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input {...docDropzone.getInputProps()} />
                {uploadingDocs ? (
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    업로드 중...
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      PDF 파일을 드래그하거나 클릭하여 업로드
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF (최대 20MB)
                    </p>
                  </div>
                )}
              </div>

              {formData.documents.length > 0 && (
                <div className="space-y-2 mt-3">
                  {formData.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-2 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          증빙문서 {i + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(i)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  formData.isPublished
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-300'
                }`}
                onClick={() =>
                  handleChange('isPublished', !formData.isPublished)
                }
              >
                {formData.isPublished && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                즉시 공개
              </span>
            </label>

            <div className="flex items-center gap-3">
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
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isEditing ? '수정 완료' : '등록'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
