import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { EquipoDeporteResponseDto } from './dto/equipo-deporte-response.dto';
import { EquiposDeportesService } from './equipos-deportes.service';

@Controller('api/v1')
export class EquiposDeportesController {
  constructor(private readonly service: EquiposDeportesService) {}

  @Post('equipos/:equipoId/deportes/:deporteId')
  asociar(
    @Param('equipoId', ParseIntPipe) equipoId: number,
    @Param('deporteId', ParseIntPipe) deporteId: number,
  ): Promise<EquipoDeporteResponseDto> {
    return this.service.asociar(equipoId, deporteId);
  }

  @Delete('equipos/:equipoId/deportes/:deporteId')
  desasociar(
    @Param('equipoId', ParseIntPipe) equipoId: number,
    @Param('deporteId', ParseIntPipe) deporteId: number,
  ) {
    return this.service.desasociar(equipoId, deporteId);
  }

  @Get('equipos/:equipoId/deportes')
  findDeportesByEquipo(
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ): Promise<EquipoDeporteResponseDto[]> {
    return this.service.findDeportesByEquipo(equipoId);
  }

  @Get('deportes/:deporteId/equipos')
  findEquiposByDeporte(
    @Param('deporteId', ParseIntPipe) deporteId: number,
  ): Promise<EquipoDeporteResponseDto[]> {
    return this.service.findEquiposByDeporte(deporteId);
  }
}
