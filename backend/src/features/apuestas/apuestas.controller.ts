import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateApuestaDto } from './dto/create-apuesta.dto';
import { ApuestaResponseDto } from './dto/apuesta-response.dto';
import { ApuestasService } from './apuestas.service';

@Controller('api/v1')
export class ApuestasController {
  constructor(private readonly service: ApuestasService) {}

  @Post('apuestas')
  create(@Body() dto: CreateApuestaDto): Promise<ApuestaResponseDto> {
    return this.service.create(dto);
  }

  @Get('apuestas')
  findAll(
    @Query('aficionadoId') aficionadoId?: string,
    @Query('partidoId') partidoId?: string,
  ): Promise<ApuestaResponseDto[]> {
    return this.service.findAll(
      aficionadoId ? parseInt(aficionadoId, 10) : undefined,
      partidoId ? parseInt(partidoId, 10) : undefined,
    );
  }

  // Contrato del plan: apuestas del aficionado (el id llega por query hasta contar con contexto JWT)
  @Get('apuestas/mis-apuestas')
  findMisApuestas(@Query('aficionadoId', ParseIntPipe) aficionadoId: number): Promise<ApuestaResponseDto[]> {
    return this.service.findByAficionado(aficionadoId);
  }

  @Get('aficionados/:id/apuestas')
  findByAficionado(@Param('id', ParseIntPipe) aficionadoId: number): Promise<ApuestaResponseDto[]> {
    return this.service.findByAficionado(aficionadoId);
  }

  @Get('partidos/:id/apuestas')
  findByPartido(@Param('id', ParseIntPipe) partidoId: number): Promise<ApuestaResponseDto[]> {
    return this.service.findByPartido(partidoId);
  }

  @Get('apuestas/partido/:partidoId/cuota')
  getCuota(@Param('partidoId', ParseIntPipe) partidoId: number) {
    return this.service.getCuota(partidoId);
  }

  @Patch('apuestas/:id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number): Promise<ApuestaResponseDto> {
    return this.service.cancelar(id);
  }

  @Post('apuestas/:id/cancelar')
  cancelarPost(@Param('id', ParseIntPipe) id: number): Promise<ApuestaResponseDto> {
    return this.service.cancelar(id);
  }
}
