import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Perfil } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: senhaHash,
      },
    });
    console.log('[usuarios] usuário criado:', usuario);
    return usuario;
  }

  // perfil inválido ou vazio = sem filtro
  findAll(perfil?: string) {
    const valido = Object.values(Perfil).includes(perfil as Perfil);

    return this.prisma.usuario.findMany({
      where: valido ? { perfil: perfil as Perfil } : undefined,
      orderBy: { nomeCompleto: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({ where: { idUsuario: id } });
  }

  findByEmail(email: string) {
    // O login precisa do hash para comparar a senha.
    return this.prisma.usuario.findUnique({
      where: { email },
      omit: { senha: false },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const dados = { ...updateUsuarioDto };

    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }

    return this.prisma.usuario.update({
      where: { idUsuario: id },
      data: dados,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { idUsuario: id } });
  }
}
