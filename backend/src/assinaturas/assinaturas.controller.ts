import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { AssinaturasService } from './assinaturas.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

// Financeiro: aluno (só as dele) e admin. Professor não acessa.
@ApiTags('assinaturas')
@ApiBearerAuth('JWT-auth')
@Perfis(Perfil.USER, Perfil.ADMIN)
@Controller('assinaturas')
export class AssinaturasController {
  constructor(private readonly assinaturasService: AssinaturasService) {}

  @Post()
  @ApiOperation({ summary: 'Assinar um plano (o aluno só para si)' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createAssinaturaDto: CreateAssinaturaDto, @Logado() logado: UsuarioLogado) {
    return this.assinaturasService.create(createAssinaturaDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar assinaturas (o aluno vê só as dele)' })
  findAll(@Logado() logado: UsuarioLogado) {
    return this.assinaturasService.findAll(logado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar assinatura pelo ID' })
  findOne(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.assinaturasService.findOne(+id, logado);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar assinatura (ex.: cancelar mudando a data de fim)' })
  update(@Param('id') id: string, @Body() updateAssinaturaDto: UpdateAssinaturaDto, @Logado() logado: UsuarioLogado) {
    return this.assinaturasService.update(+id, updateAssinaturaDto, logado);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover assinatura' })
  remove(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.assinaturasService.remove(+id, logado);
  }
}
