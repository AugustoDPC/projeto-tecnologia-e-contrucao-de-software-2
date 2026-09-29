import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt'; // Biblioteca para hash de senha

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    // Gera um salt e cria o hash da senha enviada pelo DTO
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUsuarioDto.senha, salt);

    // Salva o usuário no banco com a senha criptografada
    return this.prisma.usuario.create({
      data: { ...createUsuarioDto, senha: hash },
    });
  }

  // Método essencial para buscar usuário pelo e-mail durante o login
  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  findAll() {
    return this.prisma.usuario.findMany();
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({ where: { idUsuario: id } });
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.prisma.usuario.update({
      where: { idUsuario: id },
      data: updateUsuarioDto,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { idUsuario: id } });
  }
}
