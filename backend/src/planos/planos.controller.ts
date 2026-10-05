import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('planos')
@ApiBearerAuth('JWT-auth')
// Financeiro: professor não acessa. Aluno lê os planos; só o admin altera.
@Perfis(Perfil.USER, Perfil.ADMIN)
@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @Perfis(Perfil.ADMIN)
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

  @Perfis(Perfil.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar plano' })
  update(@Param('id') id: string, @Body() updatePlanoDto: UpdatePlanoDto) {
    return this.planosService.update(+id, updatePlanoDto);
  }

  @Perfis(Perfil.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover plano' })
  remove(@Param('id') id: string) {
    return this.planosService.remove(+id);
  }
}
