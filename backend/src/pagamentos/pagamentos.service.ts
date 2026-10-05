import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { exigirDono } from '../auth/propriedade';
import { ehAdmin, type UsuarioLogado } from '../auth/usuario-logado';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

// Pagamento não tem idUsuario: o dono é o dono da assinatura.
@Injectable()
export class PagamentosService {
  constructor(private prisma: PrismaService) {}

  async create(createPagamentoDto: CreatePagamentoDto, logado: UsuarioLogado) {
    exigirDono(await this.donoDaAssinatura(createPagamentoDto.idAssinatura), logado);

    const pagamento = await this.prisma.pagamento.create({
      data: { ...createPagamentoDto, idTransacaoGateway: `TX-${randomUUID()}` },
    });
    console.log('[pagamentos] novo pagamento:', pagamento);
    return pagamento;
  }

  findAll(logado: UsuarioLogado) {
    return this.prisma.pagamento.findMany({
      where: ehAdmin(logado) ? undefined : { assinatura: { idUsuario: logado.idUsuario } },
      orderBy: { dataPagamento: 'desc' },
    });
  }

  async findOne(id: number, logado: UsuarioLogado) {
    const pagamento = await this.prisma.pagamento.findUnique({ where: { idPagamento: id } });
    if (!pagamento) throw new NotFoundException('Pagamento não encontrado.');

    exigirDono(await this.donoDaAssinatura(pagamento.idAssinatura), logado);
    return pagamento;
  }

  async update(id: number, updatePagamentoDto: UpdatePagamentoDto, logado: UsuarioLogado) {
    await this.findOne(id, logado);
    // Mudar o pagamento de assinatura: a nova também precisa ser dele.
    if (updatePagamentoDto.idAssinatura !== undefined) {
      exigirDono(await this.donoDaAssinatura(updatePagamentoDto.idAssinatura), logado);
    }

    return this.prisma.pagamento.update({
      where: { idPagamento: id },
      data: updatePagamentoDto,
    });
  }

  async remove(id: number, logado: UsuarioLogado) {
    await this.findOne(id, logado);
    return this.prisma.pagamento.delete({ where: { idPagamento: id } });
  }

  private async donoDaAssinatura(idAssinatura: number) {
    const assinatura = await this.prisma.assinatura.findUnique({
      where: { idAssinatura },
      select: { idUsuario: true },
    });
    if (!assinatura) throw new NotFoundException('A assinatura informada não existe.');
    return assinatura.idUsuario;
  }
}
