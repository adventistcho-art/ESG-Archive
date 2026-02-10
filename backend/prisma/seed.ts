import { PrismaClient, Role, EsgType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.ac.kr' },
    update: {},
    create: {
      email: 'admin@university.ac.kr',
      password: adminPassword,
      deptName: '대학본부',
      role: Role.ADMIN,
    },
  });

  // Create department users
  const deptUsers = [
    { email: 'design@university.ac.kr', deptName: '아트앤디자인학과' },
    { email: 'welfare@university.ac.kr', deptName: '학생복지팀' },
    { email: 'greencamp@university.ac.kr', deptName: '시설관리팀' },
    { email: 'research@university.ac.kr', deptName: '산학협력단' },
  ];

  const userPassword = await bcrypt.hash('user1234', 10);
  const users = [];
  for (const dept of deptUsers) {
    const user = await prisma.user.upsert({
      where: { email: dept.email },
      update: {},
      create: {
        email: dept.email,
        password: userPassword,
        deptName: dept.deptName,
        role: Role.USER,
      },
    });
    users.push(user);
  }

  // Create sample ESG projects
  const sampleProjects = [
    {
      year: 2025,
      deptName: '시설관리팀',
      title: '친환경 캠퍼스 조성 프로젝트',
      category: EsgType.ENVIRONMENT,
      task: '탄소중립 캠퍼스 구현',
      thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop',
      oneLineSummary: '태양광 패널 설치 및 LED 교체를 통한 탄소 배출 30% 감축 달성',
      quantitative: '태양광 패널 50kW 설치, LED 교체 500개, CO2 감축 120톤',
      qualitative: '캠퍼스 전체 건물에 태양광 패널을 설치하고, 기존 형광등을 LED로 전면 교체하여 에너지 효율을 극대화하였습니다. 이를 통해 연간 탄소 배출량을 전년 대비 30% 감축하는 성과를 달성했으며, 학생과 교직원들의 환경 의식 향상에도 기여하였습니다.',
      budget: 150000000,
      shortcoming: '일부 건물의 노후 전기 배선으로 인해 태양광 시스템 연동에 추가 비용이 발생함',
      improvement: '2026년도 노후 건물 전기 설비 개선 사업과 연계하여 추진 예정',
      isPublished: true,
      userId: users[2].id,
    },
    {
      year: 2025,
      deptName: '학생복지팀',
      title: '재학생 경영참여 프로그램',
      category: EsgType.SOCIAL,
      task: '재학생 경영참여',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
      oneLineSummary: '학생 자치 기구를 통한 대학 경영 참여 활성화',
      quantitative: '학생 참여 위원회 12회 개최, 참여 학생 수 350명',
      qualitative: '학생 대표가 대학 운영위원회에 참여하여 학교 정책에 대한 의견을 직접 개진할 수 있는 체계를 구축하였습니다. 학생 복지 관련 예산 배분에 학생들의 의견이 반영되어 만족도가 크게 향상되었습니다.',
      budget: 20000000,
      shortcoming: '일부 학생들의 참여 의지 부족으로 대표성 확보에 어려움',
      improvement: '온라인 투표 시스템 도입 및 참여 인센티브 제도 강화 예정',
      isPublished: true,
      userId: users[1].id,
    },
    {
      year: 2025,
      deptName: '대학본부',
      title: '윤리경영 체계 구축',
      category: EsgType.GOVERNANCE,
      task: '투명경영 시스템 구축',
      thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
      oneLineSummary: '내부 감사 시스템 강화 및 윤리경영 교육 실시',
      quantitative: '윤리교육 이수자 800명, 내부감사 4회 실시',
      qualitative: '대학 운영의 투명성을 높이기 위해 내부 감사 시스템을 강화하고, 전 교직원 대상 윤리경영 교육을 실시하였습니다. 감사 결과를 홈페이지에 공개하여 이해관계자들의 신뢰를 확보하였습니다.',
      budget: 30000000,
      shortcoming: '윤리 신고 채널의 접근성이 다소 낮음',
      improvement: '익명 신고 앱 개발 및 보호 체계 강화 예정',
      isPublished: true,
      userId: admin.id,
    },
    {
      year: 2024,
      deptName: '아트앤디자인학과',
      title: '업사이클링 디자인 프로젝트',
      category: EsgType.ENVIRONMENT,
      task: '자원순환 교육 프로그램',
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
      oneLineSummary: '폐자재를 활용한 디자인 작품 전시 및 워크숍 운영',
      quantitative: '워크숍 8회 운영, 참여 학생 200명, 작품 50점 제작',
      qualitative: '폐플라스틱, 폐목재 등을 활용한 업사이클링 디자인 교육 프로그램을 운영하였습니다. 학생들이 제작한 작품을 전시하고, 지역사회에 자원순환의 중요성을 알리는 계기가 되었습니다.',
      budget: 15000000,
      shortcoming: '폐자재 수급이 불안정하여 프로그램 운영에 차질 발생',
      improvement: '지역 기업과 MOU 체결을 통한 안정적 소재 확보 추진',
      isPublished: true,
      userId: users[0].id,
    },
    {
      year: 2024,
      deptName: '산학협력단',
      title: '지역사회 산학협력 강화',
      category: EsgType.SOCIAL,
      task: '산학협력 네트워크 확대',
      thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
      oneLineSummary: '지역 기업 50개사와 산학협력 네트워크 구축',
      quantitative: 'MOU 체결 50건, 현장실습 참여 학생 300명',
      qualitative: '지역 산업체와의 긴밀한 협력 체계를 구축하여 학생들의 현장실습 기회를 확대하고, 기업의 R&D 역량 강화에 기여하였습니다.',
      budget: 50000000,
      shortcoming: '중소기업의 현장실습 환경이 미흡한 경우 발생',
      improvement: '현장실습 기업 평가 제도 도입 및 사전 점검 강화',
      isPublished: true,
      userId: users[3].id,
    },
    {
      year: 2024,
      deptName: '대학본부',
      title: '정보공시 시스템 개선',
      category: EsgType.GOVERNANCE,
      task: '대학정보 투명성 강화',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      oneLineSummary: '대학 운영 정보 100% 공시 및 접근성 개선',
      quantitative: '정보공시 항목 100% 달성, 웹 접근성 점수 95점',
      qualitative: '대학알리미 및 자체 홈페이지를 통한 정보공시 체계를 개선하여, 모든 운영 정보를 투명하게 공개하였습니다. 웹 접근성 기준을 준수하여 장애인도 쉽게 정보에 접근할 수 있도록 하였습니다.',
      budget: 10000000,
      shortcoming: '영문 정보공시가 미비하여 국제화 대응 부족',
      improvement: '영문 정보공시 시스템 구축 및 다국어 지원 추진',
      isPublished: true,
      userId: admin.id,
    },
  ];

  for (const project of sampleProjects) {
    await prisma.esgProject.create({
      data: project,
    });
  }

  console.log('✅ Seed data created successfully!');
  console.log(`  - Admin: admin@university.ac.kr / admin123`);
  console.log(`  - Users: design@, welfare@, greencamp@, research@ / user1234`);
  console.log(`  - ${sampleProjects.length} sample projects created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
