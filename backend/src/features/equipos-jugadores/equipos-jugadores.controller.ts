import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ActualizarVinculoDto } from './dto/actualizar-vinculo.dto';
import { AsociarJugadorDto } from './dto/asociar-jugador.dto';
import { EquipoJugadorResponseDto } from './dto/equipo-jugador-response.dto';
import { VinculoQueryDto } from './dto/vinculo-query.dto';
import { EquiposJugadoresService } from './equipos-jugadores.service';

@Controller('api/v1')
export class EquiposJugadoresController {
  constructor(private readonly service: EquiposJugadoresService) {}

  @Post('equipos/:equipoId/jugadores')
  asociar(
    @Param('equipoId', ParseIntPipe) equipoId: number,
    @Body() dto: AsociarJugadorDto,
  ): Promise<EquipoJugadorResponseDto> {
    return this.service.asociar(equipoId, dto);
  }

  @Put('equipos/:equipoId/jugadores/:jugadorId')
  actualizar(
    @Param('equipoId', ParseIntPipe) equipoId: number,
    @Param('jugadorId', ParseIntPipe) jugadorId: number,
    @Body() dto: ActualizarVinculoDto,
  ): Promise<EquipoJugadorResponseDto> {
    return this.service.actualizar(equipoId, jugadorId, dto);
  }

  // Retiro: cierra el vínculo (fechaFin), no borra al jugador
  @Delete('equipos/:equipoId/jugadores/:jugadorId')
  retirar(
    @Param('equipoId', ParseIntPipe) equipoId: number,
    @Param('jugadorId', ParseIntPipe) jugadorId: number,
  ): Promise<EquipoJugadorResponseDto> {
    return this.service.retirar(equipoId, jugadorId);
  }

  @Get('equipos/:equipoId/jugadores')
  findJugadoresByEquipo(
    @Param('equipoId', ParseIntPipe) equipoId: number,
    @Query() query: VinculoQueryDto,
  ): Promise<EquipoJugadorResponseDto[]> {
    return this.service.findJugadoresByEquipo(equipoId, query);
  }

  @Get('jugadores/:jugadorId/equipos')
  findEquiposByJugador(
    @Param('jugadorId', ParseIntPipe) jugadorId: number,
    @Query() query: VinculoQueryDto,
  ): Promise<EquipoJugadorResponseDto[]> {
    return this.service.findEquiposByJugador(jugadorId, query);
  }
}
