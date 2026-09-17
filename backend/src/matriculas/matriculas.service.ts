import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Injectable()
export class MatriculasService {
  constructor(private prisma: PrismaService) {}

  create(createMatriculaDto: CreateMatriculaDto) {
    return this.prisma.matricula.create({ data: createMatriculaDto });
  }

  findAll() {
    return this.prisma.matricula.findMany();
  }

  findOne(id: number) {
    return this.prisma.matricula.findUnique({ where: { idMatricula: id } });
  }

  update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
    return this.prisma.matricula.update({
      where: { idMatricula: id },
      data: updateMatriculaDto,
    });
  }

  remove(id: number) {
    return this.prisma.matricula.delete({ where: { idMatricula: id } });
  }
}
