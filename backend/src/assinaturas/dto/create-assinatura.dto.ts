import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';

export class CreateAssinaturaDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ example: 1, description: 'ID do plano' })
  @IsInt()
  idPlano: number;

  @ApiProperty({ example: '2026-09-03T18:00:00.000Z' })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({ example: '2027-09-03T18:00:00.000Z' })
  @IsDateString()
  dataFim: string;
}
