import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROTA_PUBLICA } from './publico.decorator';

// GUARD 1 — "quem é você?" (registrado como global no app.module.ts).
// Sem token válido: 401. Rotas com @Publico() passam direto.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(contexto: ExecutionContext) {
    const publica = this.reflector.getAllAndOverride<boolean>(ROTA_PUBLICA, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    if (publica) return true;

    return super.canActivate(contexto);
  }

  // Troca o "Unauthorized" do Passport por uma mensagem em português.
  handleRequest<T>(erro: unknown, usuario: T): T {
    if (erro || !usuario) {
      console.log('[JwtAuthGuard] token ausente, inválido ou vencido');
      throw new UnauthorizedException('Sessão expirada ou ausente. Entre novamente para continuar.');
    }
    return usuario;
  }
}
