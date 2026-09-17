import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('planos')
@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar plano' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createPlanoDto: CreatePlanoDto) {
    return this.planosService.create(createPlanoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar planos' })
  findAll() {
    return this.planosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar plano pelo ID' })
  findOne(@Param('id') id: string) {
    return this.planosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar plano' })
  update(@Param('id') id: string, @Body() updatePlanoDto: UpdatePlanoDto) {
    return this.planosService.update(+id, updatePlanoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover plano' })
  remove(@Param('id') id: string) {
    return this.planosService.remove(+id);
  }
}
