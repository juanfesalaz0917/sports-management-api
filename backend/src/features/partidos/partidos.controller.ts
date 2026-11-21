import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { PartidoResponseDto } from './dto/partido-response.dto';
import { UpdatePartidoEstadoDto } from './dto/update-partido-estado.dto';
import { RegistrarPosicionesLoteDto } from './dto/registrar-posiciones-lote.dto';
import { PartidosService } from './partidos.service';
import { PartidoPosicionesService, PosicionRegistro } from './partido-posiciones.service';

@Controller('api/v1/partidos')
export class PartidosController {
  constructor(
    private readonly service: PartidosService,
    private readonly posicionesService: PartidoPosicionesService,
  ) {}

  @Post()
  create(@Body() dto: CreatePartidoDto): Promise<PartidoResponseDto> {
    return this.service.create(dto);
  }

  @Get('disponibles-apuesta')
  findDisponiblesApuesta(): Promise<PartidoResponseDto[]> {
    return this.service.findAll();
  }

  @Get()
  findAll(@Query('torneoId') torneoId?: string): Promise<PartidoResponseDto[]> {
    return this.service.findAll(torneoId ? parseInt(torneoId, 10) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PartidoResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartidoEstadoDto,
  ): Promise<PartidoResponseDto> {
    return this.service.updateEstado(id, dto);
  }

  @Post(':id/finalizar')
  finalizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { id_equipo_ganador?: number; es_empate?: boolean },
  ) {
    return this.service.finalizarPartido(id, dto);
  }

  @Post(':id/resultado')
  registrarResultado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { id_equipo_ganador?: number; es_empate?: boolean },
  ) {
    return this.service.finalizarPartido(id, dto);
  }

  // HU-GC-09: Seguimiento deportivo en vivo (Pizarra Táctica)
  @Post(':id/posiciones')
  registrarPosiciones(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegistrarPosicionesLoteDto,
  ): PosicionRegistro[] {
    return this.posicionesService.registrarLote(id, dto);
  }

  @Get(':id/posiciones/ultimas')
  obtenerUltimasPosiciones(@Param('id', ParseIntPipe) id: number): PosicionRegistro[] {
    return this.posicionesService.obtenerUltimas(id);
  }

  @Get(':id/posiciones')
  obtenerPosiciones(
    @Param('id', ParseIntPipe) id: number,
    @Query('desde') desde?: string,
  ): PosicionRegistro[] {
    return this.posicionesService.obtenerHistorial(id, desde);
  }
}
