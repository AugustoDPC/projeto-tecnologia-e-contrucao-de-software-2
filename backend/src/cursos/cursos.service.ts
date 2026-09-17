import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  create(createCursoDto: CreateCursoDto) {
    return this.prisma.curso.create({ data: createCursoDto });
  }

  findAll() {
    return this.prisma.curso.findMany();
  }

  findOne(id: number) {
    return this.prisma.curso.findUnique({ where: { idCurso: id } });
  }

  update(id: number, updateCursoDto: UpdateCursoDto) {
    return this.prisma.curso.update({
      where: { idCurso: id },
      data: updateCursoDto,
    });
  }

  remove(id: number) {
    return this.prisma.curso.delete({ where: { idCurso: id } });
  }
}
