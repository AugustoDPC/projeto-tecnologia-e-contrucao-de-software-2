import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateAulaDto {
  @ApiProperty({ example: 1, description: 'ID do módulo' })
  @IsInt()
  idModulo: number;

  @ApiProperty({ example: 'Primeira aula' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'video', description: 'Tipo do conteúdo' })
  @IsString()
  @IsNotEmpty()
  tipoConteudo: string;

  @ApiPropertyOptional({ example: 'https://exemplo.com/aula1' })
  @IsOptional()
  @IsString()
  urlConteudo?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  duracaoMinutos?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  ordem: number;
}
