import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

// Financeiro: aluno (só das assinaturas dele) e admin. Professor não acessa.
@ApiTags('pagamentos')
@ApiBearerAuth('JWT-auth')
@Perfis(Perfil.USER, Perfil.ADMIN)
@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar pagamento (o aluno só das assinaturas dele)' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createPagamentoDto: CreatePagamentoDto, @Logado() logado: UsuarioLogado) {
    return this.pagamentosService.create(createPagamentoDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagamentos (o aluno vê só os dele)' })
  findAll(@Logado() logado: UsuarioLogado) {
    return this.pagamentosService.findAll(logado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento pelo ID' })
  findOne(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.pagamentosService.findOne(+id, logado);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pagamento' })
  update(@Param('id') id: string, @Body() updatePagamentoDto: UpdatePagamentoDto, @Logado() logado: UsuarioLogado) {
    return this.pagamentosService.update(+id, updatePagamentoDto, logado);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover pagamento' })
  remove(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.pagamentosService.remove(+id, logado);
  }
}
