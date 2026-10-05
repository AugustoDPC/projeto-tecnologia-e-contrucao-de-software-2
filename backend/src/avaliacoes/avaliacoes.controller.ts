import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { AvaliacoesService } from './avaliacoes.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

// Qualquer usuário logado. Regra de dono no service: o aluno só mexe nas avaliações dele.
@ApiTags('avaliacoes')
@ApiBearerAuth('JWT-auth')
@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Post()
  @ApiOperation({ summary: 'Avaliar um curso' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createAvaliacaoDto: CreateAvaliacaoDto, @Logado() logado: UsuarioLogado) {
    return this.avaliacoesService.create(createAvaliacaoDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar avaliações (o aluno vê só as dele)' })
  findAll(@Logado() logado: UsuarioLogado) {
    return this.avaliacoesService.findAll(logado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar avaliação pelo ID' })
  findOne(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.avaliacoesService.findOne(+id, logado);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar avaliação' })
  update(@Param('id') id: string, @Body() updateAvaliacaoDto: UpdateAvaliacaoDto, @Logado() logado: UsuarioLogado) {
    return this.avaliacoesService.update(+id, updateAvaliacaoDto, logado);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover avaliação' })
  remove(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.avaliacoesService.remove(+id, logado);
  }
}
