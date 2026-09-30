import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

const incluir = {
  plano: true,
  usuario: { select: { nomeCompleto: true } },
};

@Injectable()
export class AssinaturasService {
  constructor(private prisma: PrismaService) {}

  create(createAssinaturaDto: CreateAssinaturaDto) {
    return this.prisma.assinatura.create({ data: createAssinaturaDto });
  }

  findAll() {
    // Inclui o plano para o frontend preencher o valor do pagamento.
    return this.prisma.assinatura.findMany({ include: incluir });
  }

  findOne(id: number) {
    return this.prisma.assinatura.findUnique({
      where: { idAssinatura: id },
      include: incluir,
    });
  }

  update(id: number, updateAssinaturaDto: UpdateAssinaturaDto) {
    return this.prisma.assinatura.update({
      where: { idAssinatura: id },
      data: updateAssinaturaDto,
    });
  }

  remove(id: number) {
    return this.prisma.assinatura.delete({ where: { idAssinatura: id } });
  }
}
