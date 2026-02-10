import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum EsgType {
  ENVIRONMENT = 'ENVIRONMENT',
  SOCIAL = 'SOCIAL',
  GOVERNANCE = 'GOVERNANCE',
}

export class CreateProjectDto {
  @ApiProperty({ example: 2025 })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  year: number;

  @ApiProperty({ example: '아트앤디자인학과' })
  @IsString()
  @IsNotEmpty()
  deptName: string;

  @ApiProperty({ example: '친환경 캠퍼스 조성' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: EsgType, example: 'ENVIRONMENT' })
  @IsEnum(EsgType)
  category: EsgType;

  @ApiProperty({ example: '재학생 경영참여' })
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiPropertyOptional({ example: 'https://...' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: '태양광 패널 설치를 통한 탄소 감축' })
  @IsOptional()
  @IsString()
  oneLineSummary?: string;

  @ApiPropertyOptional({ example: '목표 100건 중 95건 달성 (95%)' })
  @IsOptional()
  @IsString()
  quantitative?: string;

  @ApiProperty({ example: '지속가능경영 체계 수립 및 환경 개선 활동 추진' })
  @IsString()
  @IsNotEmpty()
  qualitative: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  budget?: number;

  @ApiPropertyOptional({ example: '예산 집행 시기 조율 어려움' })
  @IsOptional()
  @IsString()
  shortcoming?: string;

  @ApiPropertyOptional({ example: '예산 집행 프로세스 개선 필요' })
  @IsOptional()
  @IsString()
  improvement?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  documents?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPublished?: boolean;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class ProjectFilterDto {
  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  year?: number;

  @ApiPropertyOptional({ enum: EsgType })
  @IsOptional()
  @IsEnum(EsgType)
  category?: EsgType;

  @ApiPropertyOptional({ example: '아트앤디자인학과' })
  @IsOptional()
  @IsString()
  deptName?: string;
}
