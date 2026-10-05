import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { exigirDono, filtroDoDono } from '../auth/propriedade';
import { ehEquipe, type UsuarioLogado } from '../auth/usuario-logado';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

@Injectable()
export class ProgressoAulasService {
  constructor(private prisma: PrismaService) {}

  async create(createProgressoAulaDto: CreateProgressoAulaDto, logado: UsuarioLogado) {
    exigirDono(createProgressoAulaDto.idUsuario, logado);
    await this.exigirMatricula(createProgressoAulaDto.idAula, logado);

    const progresso = await this.prisma.progressoAula.create({ data: createProgressoAulaDto });
    console.log('[progresso] registrado:', progresso);
    return progresso;
  }

  findAll(logado: UsuarioLogado) {
    return this.prisma.progressoAula.findMany({ where: filtroDoDono(logado) });
  }

  findOne(idUsuario: number, idAula: number, logado: UsuarioLogado) {
    exigirDono(idUsuario, logado);
    return this.prisma.progressoAula.findUnique({
      where: { idUsuario_idAula: { idUsuario, idAula } },
    });
  }

  update(idUsuario: number, idAula: number, updateProgressoAulaDto: UpdateProgressoAulaDto, logado: UsuarioLogado) {
    exigirDono(idUsuario, logado);
    console.log('[progresso] atualizado:', { idUsuario, idAula, ...updateProgressoAulaDto });
    return this.prisma.progressoAula.update({
      where: { idUsuario_idAula: { idUsuario, idAula } },
      data: updateProgressoAulaDto,
    });
  }

  remove(idUsuario: number, idAula: number, logado: UsuarioLogado) {
    exigirDono(idUsuario, logado);
    return this.prisma.progressoAula.delete({
      where: { idUsuario_idAula: { idUsuario, idAula } },
    });
  }

  // O aluno só registra progresso em aula de curso em que está matriculado.
  private async exigirMatricula(idAula: number, logado: UsuarioLogado) {
    if (ehEquipe(logado)) return;

    const aula = await this.prisma.aula.findUnique({ where: { idAula }, include: { modulo: true } });
    if (!aula) throw new NotFoundException('A aula informada não existe.');

    const matricula = await this.prisma.matricula.findFirst({
      where: { idUsuario: logado.idUsuario, idCurso: aula.modulo.idCurso },
    });
    if (!matricula) throw new ForbiddenException('Matricule-se no curso para registrar o progresso das aulas.');
  }
}
