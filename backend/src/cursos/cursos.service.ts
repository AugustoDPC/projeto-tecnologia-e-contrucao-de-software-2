import { BadRequestException, Injectable } from '@nestjs/common';
import { exigirDonoDoCurso } from '../auth/dono-do-curso';
import { ehAdmin, type UsuarioLogado } from '../auth/usuario-logado';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

const COM_INSTRUTOR = { instrutor: { select: { nomeCompleto: true } } };

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  create(createCursoDto: CreateCursoDto, logado: UsuarioLogado) {
    // Professor cria sempre no próprio nome; o admin escolhe o instrutor.
    const idInstrutor = ehAdmin(logado) ? createCursoDto.idInstrutor : logado.idUsuario;
    if (!idInstrutor) throw new BadRequestException('Informe o instrutor do curso.');

    console.log('[cursos] criando curso para o instrutor', idInstrutor, createCursoDto);
    return this.prisma.curso.create({ data: { ...createCursoDto, idInstrutor } });
  }

  findAll() {
    return this.prisma.curso.findMany({ include: COM_INSTRUTOR });
  }

  findOne(id: number) {
    return this.prisma.curso.findUnique({ where: { idCurso: id }, include: COM_INSTRUTOR });
  }

  async update(id: number, updateCursoDto: UpdateCursoDto, logado: UsuarioLogado) {
    await exigirDonoDoCurso(this.prisma, id, logado);

    // Professor não pode passar o curso para outro instrutor.
    const dados = { ...updateCursoDto };
    if (!ehAdmin(logado)) delete dados.idInstrutor;

    return this.prisma.curso.update({
      where: { idCurso: id },
      data: dados,
    });
  }

  async remove(id: number, logado: UsuarioLogado) {
    await exigirDonoDoCurso(this.prisma, id, logado);
    return this.prisma.curso.delete({ where: { idCurso: id } });
  }
}
