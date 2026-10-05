import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCursoDto {
  @ApiProperty({ example: 'NestJS do Zero', description: 'Título do curso' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiPropertyOptional({ example: 'Curso completo de NestJS' })
  @IsOptional()
  @IsString()
  descricao?: string;

  // O professor não escolhe: o curso fica sempre no nome dele. Só o admin informa.
  @ApiPropertyOptional({ example: 1, description: 'ID do instrutor (só o admin informa)' })
  @IsOptional()
  @IsInt()
  idInstrutor?: number;

  @ApiProperty({ example: 1, description: 'ID da categoria' })
  @IsInt()
  idCategoria: number;

  @ApiPropertyOptional({ example: 'Iniciante' })
  @IsOptional()
  @IsString()
  nivel?: string;

  @ApiPropertyOptional({ example: '2026-09-03T18:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dataPublicacao?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalAulas?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalHoras?: number;
}
