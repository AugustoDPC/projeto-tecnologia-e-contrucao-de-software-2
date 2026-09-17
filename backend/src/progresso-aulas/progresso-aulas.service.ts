import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

@Injectable()
export class ProgressoAulasService {
  constructor(private prisma: PrismaService) {}

  create(createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.prisma.progressoAula.create({ data: createProgressoAulaDto });
  }

  findAll() {
    return this.prisma.progressoAula.findMany();
  }

  findOne(idUsuario: number, idAula: number) {
    return this.prisma.progressoAula.findUnique({
      where: { idUsuario_idAula: { idUsuario, idAula } },
    });
  }

  update(idUsuario: number, idAula: number, updateProgressoAulaDto: UpdateProgressoAulaDto) {
    return this.prisma.progressoAula.update({
      where: { idUsuario_idAula: { idUsuario, idAula } },
      data: updateProgressoAulaDto,
    });
  }

  remove(idUsuario: number, idAula: number) {
    return this.prisma.progressoAula.delete({
      where: { idUsuario_idAula: { idUsuario, idAula } },
    });
  }
}
