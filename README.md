# ESG 아카이브 시스템

삼육대학교 ESG(환경·사회·거버넌스) 경영 성과를 관리하고 공개하는 디지털 아카이브 시스템입니다.

## 🚀 주요 기능

### 일반 사용자
- **ESG 전략 조회**: 대학의 ESG 경영전략과 신앙적 가치 연계 확인
- **ESG 계획**: 연도별 ESG 추진 계획 및 KPI 목표 조회
- **프로젝트 아카이브**: 연도별·카테고리별 ESG 프로젝트 성과 탐색
- **ESG 백서**: 연간 ESG 운영 결과를 백서 형태로 조회

### 관리자 (부서 담당자)
- **계획 관리**: ESG 계획 등록 (목표, KPI, 예산, 일정)
- **프로젝트 관리**: 실행 프로젝트 등록 (성과, 예산, 증빙자료)
- **결과 등록**: 프로젝트 완료 후 상세 성과 및 환류 작성

## 📁 프로젝트 구조

```
ESG아카이브/
├── frontend/          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/      # 페이지 및 API 라우트
│   │   ├── components/
│   │   └── lib/
│   └── public/       # 정적 파일 (로고 등)
└── backend/          # NestJS 백엔드 (준비 중)
    ├── src/
    └── prisma/
```

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (애니메이션)
- **Zustand** (상태 관리)
- **React Dropzone** (파일 업로드)

### Backend (준비 중)
- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **JWT 인증**

## 🚀 로컬 개발 환경 설정

### Frontend 실행

```bash
cd frontend
npm install
npm run dev
# 개발 서버: http://localhost:3000
```

### Production 빌드 및 PM2 배포

```bash
cd frontend
npm run build
pm2 start npm --name esg-archive-frontend -- start -- -p 3333
```

## 📝 환경 변수 설정

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/esg_archive"
JWT_SECRET=your-secret-key
UPLOAD_DIR=./uploads
```

## 🌐 배포

### 서버 요구사항
- Node.js 18+ 
- PM2 (프로세스 관리)
- PostgreSQL 14+ (백엔드 연동 시)

### 배포 명령어
```bash
# 1. 저장소 클론
git clone [repository-url]
cd ESG아카이브

# 2. Frontend 설정
cd frontend
npm install
npm run build
pm2 start npm --name esg-frontend -- start -- -p 3000

# 3. Backend 설정 (백엔드 준비 시)
cd ../backend
npm install
npm run build
pm2 start npm --name esg-backend -- start:prod
```

## 📄 라이선스

© 2026 삼육대학교 ESG아카이브. All rights reserved.

## 👥 문의

ESG 관련 문의: [담당자 이메일]
