import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export const METODOS_PAGAMENTO = ['Pix', 'Cartão de crédito', 'Cartão de débito'];

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

  @ApiProperty({ example: 'Pix', enum: METODOS_PAGAMENTO })
  @IsIn(METODOS_PAGAMENTO)
  metodoPagamento: string;

  // O ID da transação é gerado pelo servidor (ver PagamentosService).
}
