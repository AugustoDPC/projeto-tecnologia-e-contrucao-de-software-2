import { ForbiddenException } from '@nestjs/common';
import { ehEquipe, type UsuarioLogado } from './usuario-logado';

// REGRA DE DONO DO REGISTRO — "isto é seu?"
// Vale para o que o aluno também mexe: matrículas, progresso, avaliações,
// certificados, assinaturas e pagamentos.
// Fica no service (e não num guard) porque precisa buscar o registro no banco
// para saber de quem ele é.

// Equipe passa sempre; o aluno só passa se o registro for dele.
export function exigirDono(idDono: number, logado: UsuarioLogado) {
  if (ehEquipe(logado) || logado.idUsuario === idDono) return;
  throw new ForbiddenException('Você só pode acessar registros da sua própria conta.');
}

// Filtro para as listagens: equipe vê tudo (undefined = sem filtro no Prisma),
// o aluno vê só o que é dele.
export function filtroDoDono(logado: UsuarioLogado) {
  return ehEquipe(logado) ? undefined : { idUsuario: logado.idUsuario };
}
