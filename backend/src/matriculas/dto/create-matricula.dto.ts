import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateMatriculaDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  idCurso: number;

  @ApiPropertyOptional({ example: '2026-09-03T18:00:00.000Z', description: 'Se omitido, o banco usa a data atual' })
  @IsOptional()
  @IsDateString()
  dataMatricula?: string;

  @ApiPropertyOptional({ example: '2026-10-03T18:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dataConclusao?: string;
}
