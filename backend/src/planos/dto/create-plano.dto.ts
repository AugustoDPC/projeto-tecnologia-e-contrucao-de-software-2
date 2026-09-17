import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePlanoDto {
  @ApiProperty({ example: 'Plano Premium' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({ example: 'Acesso completo à plataforma' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: 49.9 })
  @IsNumber()
  @Min(0)
  preco: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  duracaoMeses: number;
}
