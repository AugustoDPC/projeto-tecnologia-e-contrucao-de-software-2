import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCertificadoDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  idCurso: number;

  @ApiPropertyOptional({ example: 1, description: 'ID da trilha, quando houver' })
  @IsOptional()
  @IsInt()
  idTrilha?: number;

  @ApiProperty({ example: 'CERT-ABC-123', description: 'Código único de verificação' })
  @IsString()
  @IsNotEmpty()
  codigoVerificacao: string;

  @ApiPropertyOptional({ example: '2026-09-03T18:00:00.000Z', description: 'Se omitido, o banco usa a data atual' })
  @IsOptional()
  @IsDateString()
  dataEmissao?: string;
}
