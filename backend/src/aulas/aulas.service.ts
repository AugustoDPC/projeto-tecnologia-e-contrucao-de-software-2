import { Injectable } from '@nestjs/common';
import { exigirDonoDaAula, exigirDonoDoModulo } from '../auth/dono-do-curso';
import { ehEquipe, type UsuarioLogado } from '../auth/usuario-logado';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

type AulaComCurso = { modulo: { idCurso: number }; urlConteudo: string | null };

@Injectable()
export class AulasService {
  constructor(private prisma: PrismaService) {}

  async create(createAulaDto: CreateAulaDto, logado: UsuarioLogado) {
    await exigirDonoDoModulo(this.prisma, createAulaDto.idModulo, logado);
    return this.prisma.aula.create({ data: createAulaDto });
  }

  // Todo mundo vê a lista de aulas (título, tipo, duração) para conhecer o curso.
  // O conteúdo (urlConteudo) só vai para quem está matriculado — ou para a equipe.
  async findAll(logado: UsuarioLogado) {
    const aulas = await this.prisma.aula.findMany({
      include: { modulo: { select: { idCurso: true } } },
      orderBy: [{ idModulo: 'asc' }, { ordem: 'asc' }],
    });
    const liberados = await this.cursosLiberados(logado);
    return aulas.map((aula) => this.comAcesso(aula, liberados));
  }

  async findOne(id: number, logado: UsuarioLogado) {
    const aula = await this.prisma.aula.findUnique({
      where: { idAula: id },
      include: { modulo: { select: { idCurso: true } } },
    });
    if (!aula) return null;
    return this.comAcesso(aula, await this.cursosLiberados(logado));
  }

  async update(id: number, updateAulaDto: UpdateAulaDto, logado: UsuarioLogado) {
    await exigirDonoDaAula(this.prisma, id, logado);
    // Mover a aula para outro módulo: precisa ser dono do destino também.
    if (updateAulaDto.idModulo !== undefined) {
      await exigirDonoDoModulo(this.prisma, updateAulaDto.idModulo, logado);
    }

    return this.prisma.aula.update({
      where: { idAula: id },
      data: updateAulaDto,
    });
  }

  async remove(id: number, logado: UsuarioLogado) {
    await exigirDonoDaAula(this.prisma, id, logado);
    return this.prisma.aula.delete({ where: { idAula: id } });
  }

  // Cursos em que a pessoa pode ver o conteúdo. 'todos' = equipe.
  private async cursosLiberados(logado: UsuarioLogado): Promise<Set<number> | 'todos'> {
    if (ehEquipe(logado)) return 'todos';

    const matriculas = await this.prisma.matricula.findMany({
      where: { idUsuario: logado.idUsuario },
      select: { idCurso: true },
    });
    return new Set(matriculas.map((m) => m.idCurso));
  }

  // Tira o "modulo" da resposta, acrescenta idCurso e liberada (a tela mostra o cadeado)
  // e esconde o conteúdo de quem não está matriculado.
  private comAcesso<T extends AulaComCurso>(aula: T, liberados: Set<number> | 'todos') {
    const { modulo, ...dados } = aula;
    const liberada = liberados === 'todos' || liberados.has(modulo.idCurso);
    return { ...dados, idCurso: modulo.idCurso, liberada, urlConteudo: liberada ? dados.urlConteudo : null };
  }
}
