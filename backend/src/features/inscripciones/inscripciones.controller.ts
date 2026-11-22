import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PageQueryDto } from '../../core/pagination/page-query.dto';
import { PageResponseDto } from '../../core/pagination/page-response.dto';
import { InscribirEquipoDto } from './dto/inscribir-equipo.dto';
import { InscripcionResponseDto } from './dto/inscripcion-response.dto';
import { InscripcionesService } from './inscripciones.service';

@Controller('api/v1')
export class InscripcionesController {
  constructor(private readonly service: InscripcionesService) {}

  @Post('torneos/:torneoId/inscripciones')
  inscribir(
    @Param('torneoId', ParseIntPipe) torneoId: number,
    @Body() dto: InscribirEquipoDto,
  ): Promise<InscripcionResponseDto> {
    return this.service.inscribir(torneoId, dto.equipoId);
  }

  @Delete('torneos/:torneoId/inscripciones/:equipoId')
  retirar(
    @Param('torneoId', ParseIntPipe) torneoId: number,
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ) {
    return this.service.retirar(torneoId, equipoId);
  }

  @Get('torneos/:torneoId/inscripciones')
  findByTorneo(
    @Param('torneoId', ParseIntPipe) torneoId: number,
    @Query() query: PageQueryDto,
  ): Promise<PageResponseDto<InscripcionResponseDto>> {
    return this.service.findByTorneo(torneoId, query);
  }

  // Contrato para B: equipos habilitados (inscritos y activos)
  @Get('torneos/:torneoId/equipos')
  findEquiposHabilitados(
    @Param('torneoId', ParseIntPipe) torneoId: number,
  ): Promise<InscripcionResponseDto[]> {
    return this.service.findEquiposHabilitados(torneoId);
  }

  @Get('equipos/:equipoId/torneos')
  findByEquipo(
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ): Promise<InscripcionResponseDto[]> {
    return this.service.findByEquipo(equipoId);
  }
}
