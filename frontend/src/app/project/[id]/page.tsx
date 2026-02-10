'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
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
import { projectsAPI } from '@/lib/api';
import { EsgProject } from '@/lib/types';
import {
  getCategoryLabel,
  getCategoryKorean,
  getCategoryAccentColor,
  formatBudget,
} from '@/lib/utils';
import Header from '@/components/Header';

const categoryIcons: Record<string, any> = {
  ENVIRONMENT: Leaf,
  SOCIAL: Users,
  GOVERNANCE: Shield,
};

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<EsgProject | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id) {
      loadProject(params.id as string);
    }
  }, [params.id]);

  const loadProject = async (id: string) => {
    try {
      const data = await projectsAPI.getOne(id);
      setProject(data);
    } catch (e) {
      console.error('Failed to load project', e);
    } finally {
      setLoading(false);
    }
  };

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

    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = -pdfHeight + (imgHeight * ratio - heightLeft - pdfHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;
    }

    pdf.save(`ESG_${project.year}_${project.title}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-6 pt-24">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-100 rounded-lg" />
            <div className="h-64 bg-gray-100 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-6 pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            프로젝트를 찾을 수 없습니다
          </h1>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            메인으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[project.category];
  const accentColor = getCategoryAccentColor(project.category);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8 no-print">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            아카이브로 돌아가기
          </a>
          <button
            onClick={handlePdfDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF로 저장
          </button>
        </div>

        {/* PDF Content */}
        <div ref={contentRef} className="bg-white">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {getCategoryLabel(project.category)}
              </span>
              <span className="text-sm text-gray-400">{project.year}년</span>
            </div>

            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
              {project.deptName} · {project.task}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-80 object-cover"
              />
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              {
                icon: <BarChart3 className="w-5 h-5" />,
                label: '카테고리',
                value: getCategoryKorean(project.category),
              },
              {
                icon: <FileText className="w-5 h-5" />,
                label: '사업연도',
                value: `${project.year}년`,
              },
              {
                icon: <Wallet className="w-5 h-5" />,
                label: '집행예산',
                value: formatBudget(project.budget),
              },
              {
                icon: <Users className="w-5 h-5" />,
                label: '담당부서',
                value: project.deptName,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: accentColor }}>{item.icon}</span>
                  <span className="text-xs font-medium text-gray-400">
                    {item.label}
                  </span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {project.quantitative && (
              <DetailSection
                icon={<TrendingUp className="w-5 h-5" />}
                title="정량적 실적"
                color={accentColor}
              >
                <p className="text-gray-700 leading-relaxed">
                  {project.quantitative}
                </p>
              </DetailSection>
            )}

            <DetailSection
              icon={<FileText className="w-5 h-5" />}
              title="정성적 실적"
              color={accentColor}
            >
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.qualitative}
              </p>
            </DetailSection>

            {project.shortcoming && (
              <DetailSection
                icon={<AlertTriangle className="w-5 h-5" />}
                title="사업운영 미비점"
                color="#f59e0b"
              >
                <p className="text-gray-700 leading-relaxed">
                  {project.shortcoming}
                </p>
              </DetailSection>
            )}

            {project.improvement && (
              <DetailSection
                icon={<TrendingUp className="w-5 h-5" />}
                title="개선 계획"
                color="#10b981"
              >
                <p className="text-gray-700 leading-relaxed">
                  {project.improvement}
                </p>
              </DetailSection>
            )}

            {project.images?.length > 0 && (
              <DetailSection
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
              </DetailSection>
            )}

            {project.documents?.length > 0 && (
              <DetailSection
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
              </DetailSection>
            )}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-300">
              삼육대학교 ESG아카이브 · Generated on{' '}
              {new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailSection({
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="pl-12">{children}</div>
    </motion.div>
  );
}
