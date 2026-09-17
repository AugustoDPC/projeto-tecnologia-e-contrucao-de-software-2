import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateModuloDto {
  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  idCurso: number;

  @ApiProperty({ example: 'Introdução', description: 'Título do módulo' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 1, description: 'Ordem do módulo no curso' })
  @IsInt()
  ordem: number;
}
