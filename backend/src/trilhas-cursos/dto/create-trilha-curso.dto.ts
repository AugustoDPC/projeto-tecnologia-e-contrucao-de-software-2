import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateTrilhaCursoDto {
  @ApiProperty({ example: 1, description: 'ID da trilha' })
  @IsInt()
  idTrilha: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  idCurso: number;

  @ApiProperty({ example: 1, description: 'Ordem do curso na trilha' })
  @IsInt()
  ordem: number;
}
