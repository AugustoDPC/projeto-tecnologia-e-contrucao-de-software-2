import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

// Ler: qualquer usuário logado. Escrever: professor (só nos cursos dele) ou admin.
@ApiTags('cursos')
@ApiBearerAuth('JWT-auth')
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Post()
  @ApiOperation({ summary: 'Cadastrar curso (o professor vira o instrutor)' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createCursoDto: CreateCursoDto, @Logado() logado: UsuarioLogado) {
    return this.cursosService.create(createCursoDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cursos' })
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar curso pelo ID' })
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(+id);
  }

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar curso (só o instrutor dele ou o admin)' })
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto, @Logado() logado: UsuarioLogado) {
    return this.cursosService.update(+id, updateCursoDto, logado);
  }

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover curso (só o instrutor dele ou o admin)' })
  remove(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.cursosService.remove(+id, logado);
  }
}
