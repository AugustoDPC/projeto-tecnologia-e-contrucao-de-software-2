import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { rotulo } from './rotulos';

// O class-validator só fala inglês ("email must be an email").
// Em vez de escrever { message } em cada decorator dos DTOs, traduzimos aqui
// pelo NOME da regra (isEmail, min, isInt...). Decorator novo já nasce traduzido.

// Os limites (mínimo, máximo...) só aparecem dentro do texto em inglês.
const numero = (texto: string) => /-?\d+(\.\d+)?/.exec(texto)?.[0] ?? '?';

const TRADUCOES: Record<string, (campo: string, original: string) => string> = {
  isNotEmpty: (c) => `${c} é obrigatório`,
  isDefined: (c) => `${c} é obrigatório`,
  isString: (c) => `${c} deve ser um texto`,
  isEmail: () => 'Digite um e-mail válido',
  isInt: (c) => `${c} deve ser um número inteiro`,
  isNumber: (c) => `${c} deve ser um número`,
  isPositive: (c) => `${c} deve ser maior que zero`,
  isBoolean: (c) => `${c} deve ser verdadeiro ou falso`,
  isDateString: (c) => `${c} deve ser uma data válida`,
  isUrl: (c) => `${c} deve ser um endereço válido`,
  isEnum: (c) => `${c} tem um valor que não é aceito`,
  isIn: (c) => `${c} tem um valor que não é aceito`,
  min: (c, o) => `${c} não pode ser menor que ${numero(o)}`,
  max: (c, o) => `${c} não pode ser maior que ${numero(o)}`,
  minLength: (c, o) => `${c} deve ter no mínimo ${numero(o)} caracteres`,
  maxLength: (c, o) => `${c} deve ter no máximo ${numero(o)} caracteres`,
  // Campo que não existe no DTO (forbidNonWhitelisted).
  whitelistValidation: (c) => `O campo "${c}" não é permitido aqui`,
};

function traduzir(erro: ValidationError): string[] {
  const campo = rotulo(erro.property);
  const mensagens = Object.entries(erro.constraints ?? {}).map(([regra, original]) =>
    TRADUCOES[regra] ? TRADUCOES[regra](campo, original) : original,
  );
  return [...mensagens, ...(erro.children ?? []).flatMap(traduzir)];
}

// Entregue ao ValidationPipe no main.ts: transforma os erros crus num 400 em português.
export function erroDeValidacaoEmPortugues(erros: ValidationError[]) {
  const mensagens = erros.flatMap(traduzir);
  console.log('[validacao] dados inválidos:', mensagens);
  return new BadRequestException({
    statusCode: 400,
    error: 'Bad Request',
    message: mensagens.length ? mensagens : ['Dados inválidos'],
  });
}
