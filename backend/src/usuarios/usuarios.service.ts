import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, 10);

    return this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: senhaHash,
      },
    });
  }

  findAll() {
    return this.prisma.usuario.findMany();
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
