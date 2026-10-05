import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { exigirDono, filtroDoDono } from '../auth/propriedade';
import type { UsuarioLogado } from '../auth/usuario-logado';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Injectable()
export class MatriculasService {
  constructor(private prisma: PrismaService) {}

  async create(createMatriculaDto: CreateMatriculaDto, logado: UsuarioLogado) {
    // O aluno só matricula a si mesmo; a equipe matricula qualquer um.
    exigirDono(createMatriculaDto.idUsuario, logado);

    const jaExiste = await this.prisma.matricula.findFirst({
      where: { idUsuario: createMatriculaDto.idUsuario, idCurso: createMatriculaDto.idCurso },
    });
    if (jaExiste) throw new ConflictException('Este aluno já está matriculado neste curso.');

    const matricula = await this.prisma.matricula.create({ data: createMatriculaDto });
    console.log('[matriculas] nova matrícula:', matricula);
    return matricula;
  }

  findAll(logado: UsuarioLogado) {
    return this.prisma.matricula.findMany({ where: filtroDoDono(logado) });
  }

  async findOne(id: number, logado: UsuarioLogado) {
    const matricula = await this.prisma.matricula.findUnique({ where: { idMatricula: id } });
    if (!matricula) throw new NotFoundException('Matrícula não encontrada.');

    exigirDono(matricula.idUsuario, logado);
    return matricula;
  }

  async update(id: number, updateMatriculaDto: UpdateMatriculaDto, logado: UsuarioLogado) {
    await this.findOne(id, logado); // confere se existe e se é dele
    // Trocar o aluno da matrícula: o novo dono também precisa ser ele.
    if (updateMatriculaDto.idUsuario !== undefined) exigirDono(updateMatriculaDto.idUsuario, logado);

    return this.prisma.matricula.update({
      where: { idMatricula: id },
      data: updateMatriculaDto,
    });
  }

  async remove(id: number, logado: UsuarioLogado) {
    await this.findOne(id, logado);
    console.log('[matriculas] matrícula removida:', id);
    return this.prisma.matricula.delete({ where: { idMatricula: id } });
  }
}
