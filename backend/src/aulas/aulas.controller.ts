import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AulasService } from './aulas.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('aulas')
@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar aula' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulasService.create(createAulaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aulas' })
  findAll() {
    return this.aulasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar aula pelo ID' })
  findOne(@Param('id') id: string) {
    return this.aulasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar aula' })
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulasService.update(+id, updateAulaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover aula' })
  remove(@Param('id') id: string) {
    return this.aulasService.remove(+id);
  }
}
