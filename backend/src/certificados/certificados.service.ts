import { randomUUID } from 'crypto';
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { exigirDono, filtroDoDono } from '../auth/propriedade';
import { ehEquipe, type UsuarioLogado } from '../auth/usuario-logado';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

// Status do progresso que conta como aula concluída (mesmo texto usado nas telas).
const CONCLUIDA = 'Concluída';

@Injectable()
export class CertificadosService {
  constructor(private prisma: PrismaService) {}

  async create(createCertificadoDto: CreateCertificadoDto, logado: UsuarioLogado) {
    const { idUsuario, idCurso } = createCertificadoDto;

    // O aluno só emite o PRÓPRIO certificado, uma vez, e depois de concluir todas as aulas.
    if (!ehEquipe(logado)) {
      exigirDono(idUsuario, logado);

      const situacao = await this.elegibilidade(idUsuario, idCurso);
      if (situacao.jaEmitido) throw new ConflictException('Você já emitiu o certificado deste curso.');
      if (!situacao.concluiu) {
        throw new ForbiddenException(
          `Você ainda não concluiu o curso (${situacao.aulasConcluidas} de ${situacao.totalAulas} aulas).`,
        );
      }
    }

    const codigo = randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
    const certificado = await this.prisma.certificado.create({
      data: { ...createCertificadoDto, codigoVerificacao: `CERT-${codigo}` },
    });
    console.log('[certificados] emitido:', certificado);
    return certificado;
  }

  findAll(logado: UsuarioLogado) {
    return this.prisma.certificado.findMany({ where: filtroDoDono(logado) });
  }

  async findOne(id: number, logado: UsuarioLogado) {
    const certificado = await this.prisma.certificado.findUnique({ where: { idCertificado: id } });
    if (!certificado) throw new NotFoundException('Certificado não encontrado.');

    exigirDono(certificado.idUsuario, logado);
    return certificado;
  }

  update(id: number, updateCertificadoDto: UpdateCertificadoDto) {
    return this.prisma.certificado.update({
      where: { idCertificado: id },
      data: updateCertificadoDto,
    });
  }

  remove(id: number) {
    return this.prisma.certificado.delete({ where: { idCertificado: id } });
  }

  // Quantas aulas o curso tem, quantas a pessoa concluiu e se já tem o certificado.
  // Curso sem aulas não conta como concluído (senão daria certificado de curso vazio).
  async elegibilidade(idUsuario: number, idCurso: number) {
    const totalAulas = await this.prisma.aula.count({ where: { modulo: { idCurso } } });
    const aulasConcluidas = await this.prisma.progressoAula.count({
      where: { idUsuario, status: CONCLUIDA, aula: { modulo: { idCurso } } },
    });
    const certificado = await this.prisma.certificado.findFirst({ where: { idUsuario, idCurso } });

    const resultado = {
      totalAulas,
      aulasConcluidas,
      concluiu: totalAulas > 0 && aulasConcluidas >= totalAulas,
      jaEmitido: certificado !== null,
    };
    console.log('[certificados] elegibilidade', { idUsuario, idCurso }, resultado);
    return resultado;
  }
}
