import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Perfil } from '../generated/prisma/enums';
import { Perfis } from '../auth/perfis.decorator';
import { ehAdmin, ehEquipe, Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Admin cria contas com qualquer perfil (é assim que nascem os professores).
  @Perfis(Perfil.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar usuário com qualquer perfil (admin)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    console.log('[usuarios] admin criando usuário:', { ...createUsuarioDto, senha: '***' });
    return this.usuariosService.create(createUsuarioDto);
  }

  // A equipe lista (o professor precisa ver os alunos). ?perfil=INSTRUTOR filtra.
  @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
  @Get()
  @ApiOperation({ summary: 'Listar usuários (equipe)' })
  @ApiQuery({ name: 'perfil', required: false, enum: Perfil })
  findAll(@Query('perfil') perfil?: string) {
    return this.usuariosService.findAll(perfil);
  }

  // Atalhos para "eu mesmo" — ficam antes de ':id' para "me" não ser lido como id.
  // Usados pelas telas de Perfil; escondidos do Swagger (lá se usa /usuarios/{id}).
  @ApiExcludeEndpoint()
  @Get('me')
  findMe(@Logado() logado: UsuarioLogado) {
    return this.usuariosService.findOne(logado.idUsuario);
  }

  @ApiExcludeEndpoint()
  @Patch('me')
  updateMe(@Body() updateUsuarioDto: UpdateUsuarioDto, @Logado() logado: UsuarioLogado) {
    return this.update(String(logado.idUsuario), updateUsuarioDto, logado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário (o próprio ou a equipe)' })
  findOne(@Param('id') id: string, @Logado() logado: UsuarioLogado) {
    if (!ehEquipe(logado) && logado.idUsuario !== +id) {
      throw new ForbiddenException('Você só pode acessar o seu próprio cadastro.');
    }
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário (o próprio ou o admin). Só o admin troca o perfil.' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto, @Logado() logado: UsuarioLogado) {
    console.log('[usuarios] atualização de', id, 'por', logado, 'dados:', { ...updateUsuarioDto, senha: updateUsuarioDto.senha && '***' });

    if (!ehAdmin(logado) && logado.idUsuario !== +id) {
      throw new ForbiddenException('Você só pode alterar o seu próprio cadastro.');
    }
    if (updateUsuarioDto.perfil !== undefined && !ehAdmin(logado)) {
      throw new ForbiddenException('Somente um administrador pode alterar o perfil de um usuário.');
    }
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Perfis(Perfil.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário (admin)' })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
