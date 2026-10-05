import { SetMetadata } from '@nestjs/common';
import { Perfil } from '../generated/prisma/enums';

export const PERFIS_PERMITIDOS = 'perfisPermitidos';

// Restringe a rota (ou o controller inteiro) a alguns perfis:
//   @Perfis(Perfil.ADMIN, Perfil.INSTRUTOR)
// Sem @Perfis, basta estar logado. Quem confere é o PerfisGuard.
export const Perfis = (...perfis: Perfil[]) => SetMetadata(PERFIS_PERMITIDOS, perfis);
