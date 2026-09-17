import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('pagamentos')
@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar pagamento' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentosService.create(createPagamentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagamentos' })
  findAll() {
    return this.pagamentosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento pelo ID' })
  findOne(@Param('id') id: string) {
    return this.pagamentosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pagamento' })
  update(@Param('id') id: string, @Body() updatePagamentoDto: UpdatePagamentoDto) {
    return this.pagamentosService.update(+id, updatePagamentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover pagamento' })
  remove(@Param('id') id: string) {
    return this.pagamentosService.remove(+id);
  }
}
