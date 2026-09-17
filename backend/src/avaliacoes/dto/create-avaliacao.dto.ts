import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAvaliacaoDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  idCurso: number;

  @ApiProperty({ example: 5, description: 'Nota da avaliação' })
  @IsInt()
  nota: number;

  @ApiPropertyOptional({ example: 'Ótimo curso!' })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiPropertyOptional({ example: '2026-09-03T18:00:00.000Z', description: 'Se omitido, o banco usa a data atual' })
  @IsOptional()
  @IsDateString()
  dataAvaliacao?: string;
}
