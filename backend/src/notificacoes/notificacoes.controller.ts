import { Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Logado, type UsuarioLogado } from '../auth/usuario-logado';
import { NotificacoesService } from './notificacoes.service';

@ApiTags('notificacoes')
@ApiBearerAuth('JWT-auth')
@Controller('notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar as notificações do usuário logado' })
  minhas(@Logado() logado: UsuarioLogado) {
    return this.notificacoesService.minhas(logado.idUsuario);
  }

  @Patch('lidas')
  @ApiOperation({ summary: 'Marcar todas as notificações do usuário como lidas' })
  marcarComoLidas(@Logado() logado: UsuarioLogado) {
    return this.notificacoesService.marcarComoLidas(logado.idUsuario);
  }
}
