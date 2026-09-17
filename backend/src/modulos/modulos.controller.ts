import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('modulos')
@Controller('modulos')
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar modulo' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createModuloDto: CreateModuloDto) {
    return this.modulosService.create(createModuloDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar modulos' })
  findAll() {
    return this.modulosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar modulo pelo ID' })
  findOne(@Param('id') id: string) {
    return this.modulosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar modulo' })
  update(@Param('id') id: string, @Body() updateModuloDto: UpdateModuloDto) {
    return this.modulosService.update(+id, updateModuloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover modulo' })
  remove(@Param('id') id: string) {
    return this.modulosService.remove(+id);
  }
}
