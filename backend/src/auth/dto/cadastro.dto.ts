import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Cadastro feito pela própria pessoa. Repare que NÃO existe o campo "perfil":
// quem se cadastra sozinho é sempre aluno (com forbidNonWhitelisted, mandar "perfil" dá 400).
export class CadastroDto {
  @ApiProperty({ example: 'Pedro Aluno', description: 'Nome completo' })
  @IsString()
  @IsNotEmpty()
  nomeCompleto: string;

  @ApiProperty({ example: 'pedro@email.com', description: 'E-mail (único)' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  senha: string;
}
