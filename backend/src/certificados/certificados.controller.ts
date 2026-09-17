import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificadosService } from './certificados.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('certificados')
@Controller('certificados')
export class CertificadosController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar certificado' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso.' })
  create(@Body() createCertificadoDto: CreateCertificadoDto) {
    return this.certificadosService.create(createCertificadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar certificados' })
  findAll() {
    return this.certificadosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar certificado pelo ID' })
  findOne(@Param('id') id: string) {
    return this.certificadosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar certificado' })
  update(@Param('id') id: string, @Body() updateCertificadoDto: UpdateCertificadoDto) {
    return this.certificadosService.update(+id, updateCertificadoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover certificado' })
  remove(@Param('id') id: string) {
    return this.certificadosService.remove(+id);
  }
}
