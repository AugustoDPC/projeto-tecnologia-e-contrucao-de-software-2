import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // Nunca devolve o hash da senha nas respostas (só o login pede ele explicitamente).
    super({ omit: { usuario: { senha: true } } });
  }
}