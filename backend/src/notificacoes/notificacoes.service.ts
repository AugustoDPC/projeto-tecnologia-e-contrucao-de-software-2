import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// As notificações são criadas na matrícula (MatriculasService).
@Injectable()
export class NotificacoesService {
  constructor(private prisma: PrismaService) {}

  // As notificações do usuário logado, da mais nova para a mais antiga.
  minhas(idUsuario: number) {
    return this.prisma.notificacao.findMany({
      where: { idUsuario },
      orderBy: { dataCriacao: 'desc' },
    });
  }

  // Marca todas as do usuário como lidas (o Perfil do app mostra quais são novas).
  marcarComoLidas(idUsuario: number) {
    return this.prisma.notificacao.updateMany({
      where: { idUsuario, lida: false },
      data: { lida: true },
    });
  }
}
