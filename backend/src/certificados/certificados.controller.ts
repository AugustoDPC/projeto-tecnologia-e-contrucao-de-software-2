import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { CertificadosService } from './certificados.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

// O aluno emite e vê os próprios certificados; a equipe vê e emite para todos.
// Editar e apagar certificado: só o admin.
@ApiTags('certificados')
@ApiBearerAuth('JWT-auth')
@Controller('certificados')
export class CertificadosController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @Post()
  @ApiOperation({ summary: 'Emitir certificado (o aluno só depois de concluir o curso)' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createCertificadoDto: CreateCertificadoDto, @Logado() logado: UsuarioLogado) {
    return this.certificadosService.create(createCertificadoDto, logado);
  }

  @Get()
  @ApiOperation({ summary: 'Listar certificados (o aluno vê só os dele)' })
  findAll(@Logado() logado: UsuarioLogado) {
    return this.certificadosService.findAll(logado);
  }

  // Antes de ':id' para "elegibilidade" não ser lido como id.
  @Get('elegibilidade/:idCurso')
  @ApiOperation({ summary: 'Quanto falta para eu ganhar o certificado deste curso' })
  elegibilidade(@Param('idCurso') idCurso: string, @Logado() logado: UsuarioLogado) {
    return this.certificadosService.elegibilidade(logado.idUsuario, +idCurso);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar certificado pelo ID' })
  findOne(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    return this.certificadosService.findOne(+id, logado);
  }

  @Perfis(Perfil.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar certificado (admin)' })
  update(@Param('id') id: string, @Body() updateCertificadoDto: UpdateCertificadoDto) {
    return this.certificadosService.update(+id, updateCertificadoDto);
  }

  @Perfis(Perfil.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover certificado (admin)' })
  remove(@Param('id') id: string) {
    return this.certificadosService.remove(+id);
  }
}
