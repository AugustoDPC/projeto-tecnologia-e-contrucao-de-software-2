import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client';
import { rotulo } from '../comum/rotulos';

/**
 * Traduz os erros conhecidos do Prisma em respostas HTTP legíveis.
 * Sem isso qualquer violação de constraint vira um 500 genérico.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    switch (exception.code) {
      // Violação de UNIQUE: já existe um registro com esse valor.
      case 'P2002': {
        const campos = this.camposDuplicados(exception)
          .split(', ')
          .filter(Boolean)
          .map(rotulo)
          .join(', ');
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: campos
            ? `Já existe um registro com este valor em: ${campos}`
            : 'Já existe um registro com estes dados',
        });
      }

      // Registro não encontrado (update ou delete de um id inexistente).
      case 'P2025':
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'Registro não encontrado',
        });

      // Chave estrangeira apontando para um registro que não existe.
      case 'P2003': {
        // No DELETE, o problema é o contrário: outros registros dependem deste.
        if (host.switchToHttp().getRequest<Request>().method === 'DELETE') {
          return response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            error: 'Conflict',
            message: 'Não é possível excluir: existem outros registros ligados a este. Exclua-os primeiro.',
          });
        }
        const campo = this.campoDaChaveEstrangeira(exception);
        const conhecido = campo && rotulo(campo) !== campo;
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: conhecido
            ? `O registro escolhido em "${rotulo(campo)}" não existe`
            : 'Um dos registros relacionados não existe',
        });
      }

      default:
        // Códigos não tratados continuam como 500, mas ficam registrados no log.
        this.logger.error(
          `Erro Prisma não tratado: ${exception.code}`,
          exception.stack,
        );
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
          message: 'Erro ao acessar o banco de dados',
        });
    }
  }

  /**
   * O campo duplicado chega em dois formatos: `meta.target` no Prisma sem
   * driver adapter, e o erro cru do PostgreSQL quando o adapter está em uso.
   */
  private camposDuplicados(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    const meta = (exception.meta ?? {}) as Record<string, any>;

    if (Array.isArray(meta.target)) return meta.target.join(', ');
    if (typeof meta.target === 'string') return meta.target;

    const causa = meta.driverAdapterError?.cause;
    const tabela: string | undefined = causa?.table;
    const indice: string | undefined =
      causa?.constraint?.index ?? causa?.constraint?.fields?.join(', ');
    if (!indice) return '';

    // O Prisma nomeia o índice como "<Tabela>_<Campo>_key".
    let campo = indice;
    if (tabela && campo.startsWith(`${tabela}_`)) {
      campo = campo.slice(tabela.length + 1);
    }
    return campo.replace(/_key$/, '');
  }

  private campoDaChaveEstrangeira(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    const meta = (exception.meta ?? {}) as Record<string, any>;

    if (typeof meta.field_name === 'string') return meta.field_name;

    const causa = meta.driverAdapterError?.cause;
    return causa?.constraint?.foreignKey ?? causa?.constraint?.index ?? '';
  }
}
