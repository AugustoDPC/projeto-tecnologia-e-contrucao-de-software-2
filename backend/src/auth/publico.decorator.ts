import { SetMetadata } from '@nestjs/common';

export const ROTA_PUBLICA = 'rotaPublica';

// O JwtAuthGuard é global: TODA rota exige login, menos as marcadas com @Publico().
// Só o login e o cadastro usam isto (sem eles ninguém conseguiria o primeiro token).
export const Publico = () => SetMetadata(ROTA_PUBLICA, true);
