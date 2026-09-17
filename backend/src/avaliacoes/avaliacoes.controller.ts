import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvaliacoesService } from './avaliacoes.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('avaliacoes')
@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar avaliacao' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createAvaliacaoDto: CreateAvaliacaoDto) {
    return this.avaliacoesService.create(createAvaliacaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar avaliacoes' })
  findAll() {
    return this.avaliacoesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar avaliacao pelo ID' })
  findOne(@Param('id') id: string) {
    return this.avaliacoesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar avaliacao' })
  update(@Param('id') id: string, @Body() updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return this.avaliacoesService.update(+id, updateAvaliacaoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover avaliacao' })
  remove(@Param('id') id: string) {
    return this.avaliacoesService.remove(+id);
  }
}
