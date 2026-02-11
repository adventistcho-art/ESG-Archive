'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProposalForm from '@/components/ProposalForm';
import { PerformanceProposal } from '@/lib/types';
import { FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProposalSubmitPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (data: Partial<PerformanceProposal>) => {
    // Mock API 호출 - 실제로는 backend API 연동
    console.log('안건 제출:', data);
    
    // 임시: localStorage에 저장 (실제로는 API 호출)
    const existingProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    const newProposal: PerformanceProposal = {
      ...data,
      id: Date.now().toString(),
      submitterId: 'user-' + Date.now(),
      submitterName: '제출자', // 실제로는 로그인 사용자 정보
      submitterDept: '부서명',
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as PerformanceProposal;
    
    existingProposals.push(newProposal);
    localStorage.setItem('proposals', JSON.stringify(existingProposals));
    
    // 성공 페이지 표시
    setIsSubmitted(true);
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              안건이 제출되었습니다
            </h1>
            
            <p className="text-gray-600 mb-8">
              성과상여금심사위원회에서 검토 후 처리 결과를 알려드립니다.
              <br />
              제출하신 안건은 관리자 페이지에서 확인하실 수 있습니다.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                메인으로
              </Link>
              <Link
                href="/proposals/submit"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                onClick={() => setIsSubmitted(false)}
              >
                추가 안건 제출
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="삼육대학교" className="h-8 w-auto bg-white rounded-full p-0.5" />
              <span className="text-xl font-bold text-gray-900">ESG아카이브</span>
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>성과상여금심사위원회 안건 제출</span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 안내 메시지 */}
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              안건 제출 안내
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>성과상여금 지원 대상 프로젝트에 대한 안건을 제출할 수 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>모든 필수 항목(*)을 작성해주시고, 증빙자료 목록을 정확히 입력해주세요.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>제출된 안건은 성과상여금심사위원회에서 검토 후 등급(S/A/B/C/D)이 결정됩니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>프로젝트별 등급 기준: S(30억 이상), A(20억 이상), B(10억 이상), C(3억 이상), D(3억 미만)</span>
              </li>
            </ul>
          </div>

          {/* 폼 */}
          <ProposalForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="삼육대학교" className="h-8 w-auto bg-white rounded-full p-0.5" />
              <div>
                <div className="font-bold">삼육대학교</div>
                <div className="text-sm text-gray-400">ESG아카이브</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 삼육대학교 ESG아카이브. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
