import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectFilterDto } from './dto/project.dto';

@ApiTags('Projects')
@Controller('api/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // ===== PUBLIC ENDPOINTS =====

  @Get()
  @ApiOperation({ summary: '공개 프로젝트 목록 (필터 지원)' })
  findAll(@Query() filter: ProjectFilterDto) {
    return this.projectsService.findAll(filter);
  }

  @Get('years')
  @ApiOperation({ summary: '사용 가능한 연도 목록' })
  getYears() {
    return this.projectsService.getAvailableYears();
  }

  @Get('stats')
  @ApiOperation({ summary: '프로젝트 통계' })
  getStats() {
    return this.projectsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '프로젝트 상세 조회' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // ===== ADMIN ENDPOINTS =====

  @Get('admin/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자: 본인 부서 프로젝트 목록' })
  findAllAdmin(@Request() req) {
    return this.projectsService.findAllAdmin(req.user.id, req.user.role);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자: 프로젝트 생성' })
  create(@Body() dto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자: 프로젝트 수정' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Request() req) {
    return this.projectsService.update(id, dto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자: 프로젝트 삭제' })
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.id, req.user.role);
  }
}
