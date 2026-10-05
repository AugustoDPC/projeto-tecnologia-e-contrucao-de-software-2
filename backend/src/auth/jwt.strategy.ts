import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from './auth.service';
import type { UsuarioLogado } from './usuario-logado';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const segredo = process.env.JWT_SECRET;
    if (!segredo) throw new Error('JWT_SECRET não definida no .env');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: segredo,
    });
  }

  // Só chega aqui se a assinatura bater com o JWT_SECRET e o token não tiver vencido.
  // O que for devolvido vira req.user (e é o que o @Logado() entrega).
  validate(payload: JwtPayload): UsuarioLogado {
    console.log('[JwtStrategy] token válido, payload:', payload);
    return { idUsuario: payload.sub, email: payload.email, perfil: payload.perfil };
  }
}
