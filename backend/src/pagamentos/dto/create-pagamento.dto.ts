import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePagamentoDto {
  @ApiProperty({ example: 1, description: 'ID da assinatura' })
  @IsInt()
  idAssinatura: number;

  @ApiProperty({ example: 49.9 })
  @IsNumber()
  @Min(0)
  valorPago: number;

  @ApiPropertyOptional({ example: '2026-09-03T18:00:00.000Z', description: 'Se omitido, o banco usa a data atual' })
  @IsOptional()
  @IsDateString()
  dataPagamento?: string;

  @ApiProperty({ example: 'PIX' })
  @IsString()
  @IsNotEmpty()
  metodoPagamento: string;

  @ApiProperty({ example: 'TX-123456' })
  @IsString()
  @IsNotEmpty()
  idTransacaoGateway: string;
}
