import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { PartidoResponseDto } from './dto/partido-response.dto';
import { UpdatePartidoEstadoDto } from './dto/update-partido-estado.dto';
import { RegistrarPosicionesLoteDto } from './dto/registrar-posiciones-lote.dto';
import { PartidosService } from './partidos.service';
import { PartidoPosicionesService, PosicionRegistro } from './partido-posiciones.service';

@Controller('api/v1')
export class PartidosController {
  constructor(
    private readonly service: PartidosService,
    private readonly posicionesService: PartidoPosicionesService,
  ) {}

  @Post('partidos')
  create(@Body() dto: CreatePartidoDto): Promise<PartidoResponseDto> {
    return this.service.create(dto);
  }

  @Get('partidos/disponibles-apuesta')
  findDisponiblesApuesta(): Promise<PartidoResponseDto[]> {
    return this.service.findAll();
  }

  @Get('partidos')
  findAll(@Query('torneoId') torneoId?: string): Promise<PartidoResponseDto[]> {
    return this.service.findAll(torneoId ? parseInt(torneoId, 10) : undefined);
  }

  @Get('partidos/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PartidoResponseDto> {
    return this.service.findOne(id);
  }

  @Get('fases/:faseId/partidos')
  findByFase(@Param('faseId', ParseIntPipe) faseId: number): Promise<PartidoResponseDto[]> {
    return this.service.findByFase(faseId);
  }

  @Patch('partidos/:id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartidoEstadoDto,
  ): Promise<PartidoResponseDto> {
    return this.service.updateEstado(id, dto);
  }

  @Post('partidos/:id/finalizar')
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { id_equipo_ganador?: number; es_empate?: boolean },
  ) {
    return this.service.finalizarPartido(id, dto);
  }

  @Post('partidos/:id/resultado')
  registrarResultado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { id_equipo_ganador?: number; es_empate?: boolean },
  ) {
    return this.service.finalizarPartido(id, dto);
  }

  @Put('partidos/:id/resultado')
  actualizarResultado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { id_equipo_ganador?: number; es_empate?: boolean },
  ) {
    return this.service.finalizarPartido(id, dto);
  }

  // HU-GC-09: Seguimiento deportivo en vivo (Pizarra Táctica)
  @Post('partidos/:id/posiciones')
  registrarPosiciones(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegistrarPosicionesLoteDto,
  ): PosicionRegistro[] {
    return this.posicionesService.registrarLote(id, dto);
  }

  @Get('partidos/:id/posiciones/ultimas')
  obtenerUltimasPosiciones(@Param('id', ParseIntPipe) id: number): PosicionRegistro[] {
    return this.posicionesService.obtenerUltimas(id);
  }

  @Get('partidos/:id/posiciones')
  obtenerPosiciones(
    @Param('id', ParseIntPipe) id: number,
    @Query('desde') desde?: string,
  ): PosicionRegistro[] {
    return this.posicionesService.obtenerHistorial(id, desde);
  }
}
