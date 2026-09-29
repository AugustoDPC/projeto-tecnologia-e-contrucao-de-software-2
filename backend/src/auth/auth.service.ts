import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload { sub: number; email: string; }

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Busca o usuário pelo e-mail
    const usuario = await this.usuariosService.findByEmail(loginDto.email);

    // Compara a senha digitada com o hash salvo no banco
    if (!usuario || !(await bcrypt.compare(loginDto.senha, usuario.senha))) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Define o conteúdo do token
    const payload: JwtPayload = { sub: usuario.idUsuario, email: usuario.email };

    return {
      access_token: this.jwtService.sign(payload), // Gera o JWT assinado
    };
  }
}
