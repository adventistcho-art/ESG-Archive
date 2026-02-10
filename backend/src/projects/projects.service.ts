import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectFilterDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto, userId: string) {
    return this.prisma.esgProject.create({
      data: {
        ...dto,
        images: dto.images || [],
        documents: dto.documents || [],
        userId,
      },
      include: { user: { select: { id: true, email: true, deptName: true } } },
    });
  }

  async findAll(filter: ProjectFilterDto) {
    const where: any = { isPublished: true };
    if (filter.year) where.year = filter.year;
    if (filter.category) where.category = filter.category;
    if (filter.deptName) where.deptName = { contains: filter.deptName };

    return this.prisma.esgProject.findMany({
      where,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      include: { user: { select: { id: true, email: true, deptName: true } } },
    });
  }

  async findAllAdmin(userId: string, userRole: string) {
    const where: any = {};
    if (userRole !== 'ADMIN') {
      where.userId = userId;
    }

    return this.prisma.esgProject.findMany({
      where,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      include: { user: { select: { id: true, email: true, deptName: true } } },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.esgProject.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, deptName: true } } },
    });
    if (!project) {
      throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, userId: string, userRole: string) {
    const project = await this.findOne(id);
    if (userRole !== 'ADMIN' && project.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    return this.prisma.esgProject.update({
      where: { id },
      data: dto,
      include: { user: { select: { id: true, email: true, deptName: true } } },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const project = await this.findOne(id);
    if (userRole !== 'ADMIN' && project.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    return this.prisma.esgProject.delete({ where: { id } });
  }

  async getAvailableYears() {
    const results = await this.prisma.esgProject.findMany({
      where: { isPublished: true },
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' },
    });
    return results.map((r) => r.year);
  }

  async getStats() {
    const [total, published, byCategory] = await Promise.all([
      this.prisma.esgProject.count(),
      this.prisma.esgProject.count({ where: { isPublished: true } }),
      this.prisma.esgProject.groupBy({
        by: ['category'],
        _count: true,
      }),
    ]);

    return { total, published, byCategory };
  }
}
