import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { AulasService } from './aulas.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

// Ler: qualquer usuário logado (o conteúdo só sai para quem é matriculado).
// Escrever: professor dono do curso ou admin.
@ApiTags('aulas')
@ApiBearerAuth('JWT-auth')
@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Post()
  @ApiOperation({ summary: 'Cadastrar aula (em módulo de curso seu)' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createAulaDto: CreateAulaDto, @Logado() logado: UsuarioLogado) {
    return this.aulasService.create(createAulaDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aulas (urlConteudo só para matriculados)' })
  findAll(@Logado() logado: UsuarioLogado) {
    return this.aulasService.findAll(logado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar aula pelo ID' })
  findOne(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.aulasService.findOne(+id, logado);
  }

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar aula (de curso seu)' })
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto, @Logado() logado: UsuarioLogado) {
    return this.aulasService.update(+id, updateAulaDto, logado);
  }

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover aula (de curso seu)' })
  remove(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.aulasService.remove(+id, logado);
  }
}
