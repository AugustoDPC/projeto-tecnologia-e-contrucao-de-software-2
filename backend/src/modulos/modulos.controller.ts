import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

// Ler: qualquer usuário logado. Escrever: professor dono do curso ou admin.
@ApiTags('modulos')
@ApiBearerAuth('JWT-auth')
@Controller('modulos')
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Post()
  @ApiOperation({ summary: 'Cadastrar módulo (em curso seu)' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createModuloDto: CreateModuloDto, @Logado() logado: UsuarioLogado) {
    return this.modulosService.create(createModuloDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar módulos' })
  findAll() {
    return this.modulosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar módulo pelo ID' })
  findOne(@Param('id') id: string) {
    return this.modulosService.findOne(+id);
  }

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar módulo (de curso seu)' })
  update(@Param('id') id: string, @Body() updateModuloDto: UpdateModuloDto, @Logado() logado: UsuarioLogado) {
    return this.modulosService.update(+id, updateModuloDto, logado);
  }

  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover módulo (de curso seu)' })
  remove(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.modulosService.remove(+id, logado);
  }
}
