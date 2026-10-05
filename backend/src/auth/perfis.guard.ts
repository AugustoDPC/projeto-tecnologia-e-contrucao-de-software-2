import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Perfil } from '../generated/prisma/enums';
import { PERFIS_PERMITIDOS } from './perfis.decorator';
import type { UsuarioLogado } from './usuario-logado';

// GUARD 2 — "você pode?" (global, roda depois do JwtAuthGuard).
// Compara o perfil que está no token com o @Perfis(...) da rota. Não pode: 403.
@Injectable()
export class PerfisGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext) {
    const permitidos = this.reflector.getAllAndOverride<Perfil[] | undefined>(PERFIS_PERMITIDOS, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    // Rota sem @Perfis: qualquer pessoa logada pode.
    if (!permitidos?.length) return true;

    const usuario: UsuarioLogado | undefined = contexto.switchToHttp().getRequest().user;
    console.log('[PerfisGuard] perfil do token:', usuario?.perfil, '| permitidos:', permitidos);

    if (!usuario || !permitidos.includes(usuario.perfil)) {
      throw new ForbiddenException('Seu tipo de conta não tem permissão para esta ação.');
    }
    return true;
  }
}
