import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ehAdmin, type UsuarioLogado } from './usuario-logado';

// REGRA DE DONO DO CURSO — "este curso é seu?"
// O dono do curso é o instrutor dele (Cursos.ID_Instrutor), e a posse desce em cadeia:
//   Aula -> Módulo -> Curso -> instrutor
// O professor só edita o conteúdo dos próprios cursos. O admin pode tudo.

export async function exigirDonoDoCurso(prisma: PrismaService, idCurso: number, logado: UsuarioLogado) {
  if (ehAdmin(logado)) return;

  const curso = await prisma.curso.findUnique({ where: { idCurso }, select: { idInstrutor: true } });
  if (!curso) throw new NotFoundException('O curso informado não existe.');

  if (curso.idInstrutor !== logado.idUsuario) {
    console.log('[dono-do-curso] professor', logado.idUsuario, 'tentou mexer no curso', idCurso);
    throw new ForbiddenException('Este curso pertence a outro professor. Você só pode editar os seus cursos.');
  }
}

export async function exigirDonoDoModulo(prisma: PrismaService, idModulo: number, logado: UsuarioLogado) {
  if (ehAdmin(logado)) return;

  const modulo = await prisma.modulo.findUnique({ where: { idModulo }, select: { idCurso: true } });
  if (!modulo) throw new NotFoundException('O módulo informado não existe.');

  await exigirDonoDoCurso(prisma, modulo.idCurso, logado);
}

export async function exigirDonoDaAula(prisma: PrismaService, idAula: number, logado: UsuarioLogado) {
  if (ehAdmin(logado)) return;

  const aula = await prisma.aula.findUnique({ where: { idAula }, select: { idModulo: true } });
  if (!aula) throw new NotFoundException('A aula informada não existe.');

  await exigirDonoDoModulo(prisma, aula.idModulo, logado);
}
