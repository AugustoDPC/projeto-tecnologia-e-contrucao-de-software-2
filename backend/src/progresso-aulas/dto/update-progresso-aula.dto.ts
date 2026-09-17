import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProgressoAulaDto } from './create-progresso-aula.dto';

export class UpdateProgressoAulaDto extends PartialType(
  OmitType(CreateProgressoAulaDto, ['idUsuario', 'idAula'] as const),
) {}
