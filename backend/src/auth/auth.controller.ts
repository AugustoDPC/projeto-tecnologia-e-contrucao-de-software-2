import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CadastroDto } from './dto/cadastro.dto';
import { LoginDto } from './dto/login.dto';
import { Publico } from './publico.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Publico()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário e gerar token JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'E-mail ou senha incorretos.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Publico()
  @Post('cadastrar')
  @ApiOperation({ summary: 'Criar a própria conta (sempre como aluno)' })
  @ApiResponse({ status: 201, description: 'Conta criada com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  cadastrar(@Body() cadastroDto: CadastroDto) {
    return this.authService.cadastrar(cadastroDto);
  }
}
