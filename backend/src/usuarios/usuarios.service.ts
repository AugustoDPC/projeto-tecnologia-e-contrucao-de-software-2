import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Excluir o usuário apaga junto TUDO que é dele, sem precisar desligar nada antes.
  // Tudo numa transação: se algo falhar, nada é apagado.
  async remove(id: number) {
    const usuario = await this.findOne(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    // Cursos em que ele é o professor: somem junto, com todo o conteúdo
    const cursos = await this.prisma.curso.findMany({ where: { idInstrutor: id }, select: { idCurso: true } });
    const idsCursos = cursos.map((c) => c.idCurso);
    const doCurso = { idCurso: { in: idsCursos } };
    const aulasDosCursos = { aula: { modulo: doCurso } };

    await this.prisma.$transaction([
      // 1) O que é do usuário como aluno
      this.prisma.notificacao.deleteMany({ where: { idUsuario: id } }),
      this.prisma.progressoAula.deleteMany({ where: { idUsuario: id } }),
      this.prisma.avaliacao.deleteMany({ where: { idUsuario: id } }),
      this.prisma.certificado.deleteMany({ where: { idUsuario: id } }),
      this.prisma.matricula.deleteMany({ where: { idUsuario: id } }),
      this.prisma.pagamento.deleteMany({ where: { assinatura: { idUsuario: id } } }),
      this.prisma.assinatura.deleteMany({ where: { idUsuario: id } }),

      // 2) Os cursos que ele ministra (e o que os alunos tinham nesses cursos)
      this.prisma.progressoAula.deleteMany({ where: aulasDosCursos }),
      this.prisma.aula.deleteMany({ where: { modulo: doCurso } }),
      this.prisma.modulo.deleteMany({ where: doCurso }),
      this.prisma.matricula.deleteMany({ where: doCurso }),
      this.prisma.avaliacao.deleteMany({ where: doCurso }),
      this.prisma.certificado.deleteMany({ where: doCurso }),
      this.prisma.trilhaCurso.deleteMany({ where: doCurso }),
      this.prisma.curso.deleteMany({ where: doCurso }),

      // 3) Por último, o próprio usuário
      this.prisma.usuario.delete({ where: { idUsuario: id } }),
    ]);

    console.log(`[usuarios] usuário ${id} excluído junto com ${idsCursos.length} curso(s) que ministrava`);
    return usuario;
  }
}
