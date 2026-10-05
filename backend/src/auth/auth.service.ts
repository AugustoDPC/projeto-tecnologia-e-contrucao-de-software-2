import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Perfil } from '../generated/prisma/enums';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CadastroDto } from './dto/cadastro.dto';
import { LoginDto } from './dto/login.dto';

// Conteúdo do token. O perfil vai aqui dentro para os guards não precisarem
// consultar o banco a cada requisição.
export interface JwtPayload {
  sub: number;
  email: string;
  perfil: Perfil;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    console.log('[login] e-mail recebido:', loginDto.email);
    const usuario = await this.usuariosService.findByEmail(loginDto.email);
    console.log('[login] usuário encontrado no banco:', usuario);

    // Mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails existem.
    const senhaConfere = usuario && (await bcrypt.compare(loginDto.password, usuario.senha));
    if (!senhaConfere) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const payload: JwtPayload = { sub: usuario.idUsuario, email: usuario.email, perfil: usuario.perfil };
    const access_token = await this.jwtService.signAsync(payload);
    console.log('[login] payload do token:', payload);
    console.log('[login] token gerado:', access_token);

    return { access_token };
  }

  // Cadastro público: SEMPRE cria aluno. O perfil é fixado aqui, não vem da requisição.
  // Professores e admins são criados pelo admin em POST /usuarios.
  cadastrar(cadastroDto: CadastroDto) {
    console.log('[cadastro] dados recebidos:', { ...cadastroDto, senha: '***' });
    return this.usuariosService.create({ ...cadastroDto, perfil: Perfil.USER });
  }
}
