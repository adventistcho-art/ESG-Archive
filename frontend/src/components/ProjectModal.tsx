'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Leaf,
  Users,
  Shield,
  FileText,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Wallet,
  Image as ImageIcon,
} from 'lucide-react';
import { EsgProject } from '@/lib/types';
import {
  getCategoryLabel,
  getCategoryKorean,
  getCategoryAccentColor,
  formatBudget,
} from '@/lib/utils';

const categoryIcons: Record<string, any> = {
  ENVIRONMENT: Leaf,
  SOCIAL: Users,
  GOVERNANCE: Shield,
};

interface ProjectModalProps {
  project: EsgProject | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handlePdfDownload = async () => {
    if (!contentRef.current || !project) return;

    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;

    let heightLeft = imgHeight * ratio;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pdfHeight;

    // Additional pages if content overflows
    while (heightLeft > 0) {
      position = -pdfHeight + (imgHeight * ratio - heightLeft - pdfHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;
    }

    pdf.save(`ESG_${project.year}_${project.title}.pdf`);
  };

  if (!project) return null;

  const Icon = categoryIcons[project.category];
  const accentColor = getCategoryAccentColor(project.category);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl my-auto"
          >
            {/* Toolbar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-xl rounded-t-3xl border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {getCategoryLabel(project.category)}
                </span>
                <span className="text-sm text-gray-400">{project.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePdfDownload}
                  className="no-print flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PDF로 저장
                </button>
                <button
                  onClick={onClose}
                  className="no-print w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content for PDF */}
            <div ref={contentRef} className="px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                  {project.deptName} · {project.task}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h1>
                {project.oneLineSummary && (
                  <p className="text-lg text-gray-500 leading-relaxed">
                    {project.oneLineSummary}
                  </p>
                )}
              </div>

              {/* Thumbnail */}
              {project.thumbnail && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <InfoCard
                  icon={<BarChart3 className="w-5 h-5" />}
                  label="카테고리"
                  value={getCategoryKorean(project.category)}
                  color={accentColor}
                />
                <InfoCard
                  icon={<FileText className="w-5 h-5" />}
                  label="사업연도"
                  value={`${project.year}년`}
                  color={accentColor}
                />
                <InfoCard
                  icon={<Wallet className="w-5 h-5" />}
                  label="집행예산"
                  value={formatBudget(project.budget)}
                  color={accentColor}
                />
                <InfoCard
                  icon={<Users className="w-5 h-5" />}
                  label="담당부서"
                  value={project.deptName}
                  color={accentColor}
                />
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {/* Quantitative */}
                {project.quantitative && (
                  <Section
                    icon={<TrendingUp className="w-5 h-5" />}
                    title="정량적 실적"
                    color={accentColor}
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {project.quantitative}
                    </p>
                  </Section>
                )}

                {/* Qualitative */}
                <Section
                  icon={<FileText className="w-5 h-5" />}
                  title="정성적 실적"
                  color={accentColor}
                >
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.qualitative}
                  </p>
                </Section>

                {/* Shortcoming */}
                {project.shortcoming && (
                  <Section
                    icon={<AlertTriangle className="w-5 h-5" />}
                    title="사업운영 미비점"
                    color="#f59e0b"
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {project.shortcoming}
                    </p>
                  </Section>
                )}

                {/* Improvement */}
                {project.improvement && (
                  <Section
                    icon={<TrendingUp className="w-5 h-5" />}
                    title="개선 계획"
                    color="#10b981"
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {project.improvement}
                    </p>
                  </Section>
                )}

                {/* Images */}
                {project.images && project.images.length > 0 && (
                  <Section
                    icon={<ImageIcon className="w-5 h-5" />}
                    title="활동 사진"
                    color={accentColor}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {project.images.map((img, i) => (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden aspect-video bg-gray-100"
                        >
                          <img
                            src={img}
                            alt={`활동 사진 ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Documents */}
                {project.documents && project.documents.length > 0 && (
                  <Section
                    icon={<FileText className="w-5 h-5" />}
                    title="증빙 문서"
                    color={accentColor}
                  >
                    <div className="space-y-2">
                      {project.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            증빙문서 {i + 1}
                          </span>
                        </a>
                      ))}
                    </div>
                  </Section>
                )}
              </div>

              {/* Footer watermark for PDF */}
              <div className="mt-12 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-300">
                  삼육대학교 ESG아카이브 · Generated on{' '}
                  {new Date().toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs font-medium text-gray-400">{label}</span>
      </div>
      <p className="font-semibold text-gray-900 text-sm">{value}</p>
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="pl-10">{children}</div>
    </div>
  );
}
