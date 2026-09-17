import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTrilhaCursoDto } from './create-trilha-curso.dto';

export class UpdateTrilhaCursoDto extends PartialType(
  OmitType(CreateTrilhaCursoDto, ['idTrilha', 'idCurso'] as const),
) {}
