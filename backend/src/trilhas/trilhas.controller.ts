import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrilhasService } from './trilhas.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('trilhas')
@Controller('trilhas')
export class TrilhasController {
  constructor(private readonly trilhasService: TrilhasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar trilha' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createTrilhaDto: CreateTrilhaDto) {
    return this.trilhasService.create(createTrilhaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar trilhas' })
  findAll() {
    return this.trilhasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar trilha pelo ID' })
  findOne(@Param('id') id: string) {
    return this.trilhasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar trilha' })
  update(@Param('id') id: string, @Body() updateTrilhaDto: UpdateTrilhaDto) {
    return this.trilhasService.update(+id, updateTrilhaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover trilha' })
  remove(@Param('id') id: string) {
    return this.trilhasService.remove(+id);
  }
}
