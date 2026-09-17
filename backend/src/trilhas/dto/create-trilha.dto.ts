import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrilhaDto {
  @ApiProperty({ example: 'Trilha Backend' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiPropertyOptional({ example: 'Sequência de cursos para backend' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: 1, description: 'ID da categoria' })
  @IsInt()
  idCategoria: number;
}
