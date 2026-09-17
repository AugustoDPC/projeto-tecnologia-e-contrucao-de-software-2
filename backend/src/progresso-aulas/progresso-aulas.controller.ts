import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProgressoAulasService } from './progresso-aulas.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

@ApiTags('progresso-aulas')
@Controller('progresso-aulas')
export class ProgressoAulasController {
  constructor(private readonly progressoAulasService: ProgressoAulasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar progresso de uma aula' })
  create(@Body() createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.progressoAulasService.create(createProgressoAulaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar progressos de aulas' })
  findAll() {
    return this.progressoAulasService.findAll();
  }

  @Get(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Buscar progresso pelo usuário e pela aula' })
  findOne(@Param('idUsuario') idUsuario: string, @Param('idAula') idAula: string) {
    return this.progressoAulasService.findOne(+idUsuario, +idAula);
  }

  @Patch(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Atualizar progresso pelo usuário e pela aula' })
  update(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
    @Body() updateProgressoAulaDto: UpdateProgressoAulaDto,
  ) {
    return this.progressoAulasService.update(+idUsuario, +idAula, updateProgressoAulaDto);
  }

  @Delete(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Remover progresso pelo usuário e pela aula' })
  remove(@Param('idUsuario') idUsuario: string, @Param('idAula') idAula: string) {
    return this.progressoAulasService.remove(+idUsuario, +idAula);
  }
}
