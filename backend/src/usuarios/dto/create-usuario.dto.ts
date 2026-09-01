import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
}
