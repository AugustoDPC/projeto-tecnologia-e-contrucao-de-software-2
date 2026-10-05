import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Perfil } from '../../generated/prisma/enums';

// Usado pelo ADMIN em POST /usuarios. O cadastro público usa o CadastroDto (sem perfil).
export class CreateUsuarioDto {
  @ApiProperty({ example: 'Augusto', description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty()
  nomeCompleto: string;

  @ApiProperty({ example: 'augusto@email.com', description: 'Email do usuário (único)' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário', minLength: 6 })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiPropertyOptional({ enum: Perfil, default: Perfil.USER, description: 'USER = aluno, INSTRUTOR = professor' })
  @IsOptional()
  @IsEnum(Perfil)
  perfil?: Perfil;
}
