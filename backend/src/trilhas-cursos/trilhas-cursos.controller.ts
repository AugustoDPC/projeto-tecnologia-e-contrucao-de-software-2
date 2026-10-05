import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TrilhasCursosService } from './trilhas-cursos.service';
import { CreateTrilhaCursoDto } from './dto/create-trilha-curso.dto';
import { UpdateTrilhaCursoDto } from './dto/update-trilha-curso.dto';

@ApiTags('trilhas-cursos')
@ApiBearerAuth('JWT-auth')
// Ler: qualquer usuário logado. Criar, editar e excluir: só o admin.
@Controller('trilhas-cursos')
export class TrilhasCursosController {
  constructor(private readonly trilhasCursosService: TrilhasCursosService) {}

  @Perfis(Perfil.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Adicionar curso a uma trilha' })
  create(@Body() createTrilhaCursoDto: CreateTrilhaCursoDto) {
    return this.trilhasCursosService.create(createTrilhaCursoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cursos das trilhas' })
  findAll() {
    return this.trilhasCursosService.findAll();
  }

  @Get(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Buscar relação entre trilha e curso' })
  findOne(@Param('idTrilha') idTrilha: string, @Param('idCurso') idCurso: string) {
    return this.trilhasCursosService.findOne(+idTrilha, +idCurso);
  }

  @Perfis(Perfil.ADMIN)
  @Patch(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Atualizar ordem do curso na trilha' })
  update(
    @Param('idTrilha') idTrilha: string,
    @Param('idCurso') idCurso: string,
    @Body() updateTrilhaCursoDto: UpdateTrilhaCursoDto,
  ) {
    return this.trilhasCursosService.update(+idTrilha, +idCurso, updateTrilhaCursoDto);
  }

  @Perfis(Perfil.ADMIN)
  @Delete(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Remover curso de uma trilha' })
  remove(@Param('idTrilha') idTrilha: string, @Param('idCurso') idCurso: string) {
    return this.trilhasCursosService.remove(+idTrilha, +idCurso);
  }
}
