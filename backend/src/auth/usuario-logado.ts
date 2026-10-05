import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Perfil } from '../generated/prisma/enums';

// O que o JwtStrategy.validate() devolve: os dados de quem fez a requisição, lidos do token.
export interface UsuarioLogado {
  idUsuario: number;
  email: string;
  perfil: Perfil;
}

// Entrega o usuário logado como parâmetro do método do controller:
//   create(@Body() dto: CreateMatriculaDto, @Logado() logado: UsuarioLogado)
export const Logado = createParamDecorator((_dados: unknown, contexto: ExecutionContext): UsuarioLogado => {
  return contexto.switchToHttp().getRequest().user;
});

export function ehAdmin(usuario: UsuarioLogado) {
  return usuario.perfil === Perfil.ADMIN;
}

// "Equipe" = quem trabalha na plataforma (professor ou admin).
// A equipe enxerga os registros de todos os alunos; o aluno só os dele.
export function ehEquipe(usuario: UsuarioLogado) {
  return usuario.perfil === Perfil.ADMIN || usuario.perfil === Perfil.INSTRUTOR;
}
