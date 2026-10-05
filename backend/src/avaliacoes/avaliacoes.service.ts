import { Injectable, NotFoundException } from '@nestjs/common';
import { exigirDono, filtroDoDono } from '../auth/propriedade';
import type { UsuarioLogado } from '../auth/usuario-logado';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Injectable()
export class AvaliacoesService {
  constructor(private prisma: PrismaService) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto, logado: UsuarioLogado) {
    exigirDono(createAvaliacaoDto.idUsuario, logado);
    const avaliacao = await this.prisma.avaliacao.create({ data: createAvaliacaoDto });
    console.log('[avaliacoes] nova avaliação:', avaliacao);
    return avaliacao;
  }

  findAll(logado: UsuarioLogado) {
    return this.prisma.avaliacao.findMany({ where: filtroDoDono(logado) });
  }

  async findOne(id: number, logado: UsuarioLogado) {
    const avaliacao = await this.prisma.avaliacao.findUnique({ where: { idAvaliacao: id } });
    if (!avaliacao) throw new NotFoundException('Avaliação não encontrada.');

    exigirDono(avaliacao.idUsuario, logado);
    return avaliacao;
  }

  async update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto, logado: UsuarioLogado) {
    await this.findOne(id, logado);
    if (updateAvaliacaoDto.idUsuario !== undefined) exigirDono(updateAvaliacaoDto.idUsuario, logado);

    return this.prisma.avaliacao.update({
      where: { idAvaliacao: id },
      data: updateAvaliacaoDto,
    });
  }

  async remove(id: number, logado: UsuarioLogado) {
    await this.findOne(id, logado);
    return this.prisma.avaliacao.delete({ where: { idAvaliacao: id } });
  }
}
