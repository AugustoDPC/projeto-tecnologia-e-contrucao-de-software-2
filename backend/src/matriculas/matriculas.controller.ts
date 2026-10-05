import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

// Qualquer usuário logado. Regra de dono no service: o aluno só mexe nas matrículas dele.
@ApiTags('matriculas')
@ApiBearerAuth('JWT-auth')
@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post()
  @ApiOperation({ summary: 'Matricular (o aluno só a si mesmo)' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createMatriculaDto: CreateMatriculaDto, @Logado() logado: UsuarioLogado) {
    return this.matriculasService.create(createMatriculaDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar matrículas (o aluno vê só as dele)' })
  findAll(@Logado() logado: UsuarioLogado) {
    return this.matriculasService.findAll(logado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar matrícula pelo ID' })
  findOne(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.matriculasService.findOne(+id, logado);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar matrícula' })
  update(@Param('id') id: string, @Body() updateMatriculaDto: UpdateMatriculaDto, @Logado() logado: UsuarioLogado) {
    return this.matriculasService.update(+id, updateMatriculaDto, logado);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar matrícula' })
  remove(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.matriculasService.remove(+id, logado);
  }
}
