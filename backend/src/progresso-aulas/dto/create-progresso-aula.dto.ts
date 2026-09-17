import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProgressoAulaDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ example: 1, description: 'ID da aula' })
  @IsInt()
  idAula: number;

  @ApiProperty({ example: '2026-09-03T18:00:00.000Z' })
  @IsDateString()
  dataConclusao: string;

  @ApiProperty({ example: 'concluida' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
