import { Injectable, NotFoundException } from '@nestjs/common';
import { exigirDono, filtroDoDono } from '../auth/propriedade';
import type { UsuarioLogado } from '../auth/usuario-logado';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

// Inclui o plano para as telas mostrarem nome e preço (e preencherem o valor do pagamento).
const incluir = {
  plano: true,
  usuario: { select: { nomeCompleto: true } },
};

@Injectable()
export class AssinaturasService {
  constructor(private prisma: PrismaService) {}

  async create(createAssinaturaDto: CreateAssinaturaDto, logado: UsuarioLogado) {
    exigirDono(createAssinaturaDto.idUsuario, logado);
    const assinatura = await this.prisma.assinatura.create({ data: createAssinaturaDto, include: incluir });
    console.log('[assinaturas] nova assinatura:', assinatura);
    return assinatura;
  }

  findAll(logado: UsuarioLogado) {
    return this.prisma.assinatura.findMany({
      where: filtroDoDono(logado),
      include: incluir,
      orderBy: { dataInicio: 'desc' },
    });
  }

  async findOne(id: number, logado: UsuarioLogado) {
    const assinatura = await this.prisma.assinatura.findUnique({
      where: { idAssinatura: id },
      include: incluir,
    });
    if (!assinatura) throw new NotFoundException('Assinatura não encontrada.');

    exigirDono(assinatura.idUsuario, logado);
    return assinatura;
  }

  async update(id: number, updateAssinaturaDto: UpdateAssinaturaDto, logado: UsuarioLogado) {
    await this.findOne(id, logado);
    if (updateAssinaturaDto.idUsuario !== undefined) exigirDono(updateAssinaturaDto.idUsuario, logado);

    console.log('[assinaturas] atualizada:', id, updateAssinaturaDto);
    return this.prisma.assinatura.update({
      where: { idAssinatura: id },
      data: updateAssinaturaDto,
    });
  }

  async remove(id: number, logado: UsuarioLogado) {
    await this.findOne(id, logado);
    return this.prisma.assinatura.delete({ where: { idAssinatura: id } });
  }
}
