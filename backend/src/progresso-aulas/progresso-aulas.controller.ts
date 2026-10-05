import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { ProgressoAulasService } from './progresso-aulas.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

// Qualquer usuário logado. Regra de dono no service: o aluno só mexe no progresso dele.
@ApiTags('progresso-aulas')
@ApiBearerAuth('JWT-auth')
@Controller('progresso-aulas')
export class ProgressoAulasController {
  constructor(private readonly progressoAulasService: ProgressoAulasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar progresso de uma aula' })
  create(@Body() createProgressoAulaDto: CreateProgressoAulaDto, @Logado() logado: UsuarioLogado) {
    return this.progressoAulasService.create(createProgressoAulaDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar progressos (o aluno vê só os dele)' })
  findAll(@Logado() logado: UsuarioLogado) {
    return this.progressoAulasService.findAll(logado);
  }

  @Get(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Buscar progresso pelo usuário e pela aula' })
  findOne(@Param('idUsuario') idUsuario: string, @Param('idAula') idAula: string, @Logado() logado: UsuarioLogado) {
    return this.progressoAulasService.findOne(+idUsuario, +idAula, logado);
  }

  @Patch(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Atualizar progresso pelo usuário e pela aula' })
  update(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
    @Body() updateProgressoAulaDto: UpdateProgressoAulaDto,
    @Logado() logado: UsuarioLogado,
  ) {
    return this.progressoAulasService.update(+idUsuario, +idAula, updateProgressoAulaDto, logado);
  }

  @Delete(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Remover progresso pelo usuário e pela aula' })
  remove(@Param('idUsuario') idUsuario: string, @Param('idAula') idAula: string, @Logado() logado: UsuarioLogado) {
    return this.progressoAulasService.remove(+idUsuario, +idAula, logado);
  }
}
