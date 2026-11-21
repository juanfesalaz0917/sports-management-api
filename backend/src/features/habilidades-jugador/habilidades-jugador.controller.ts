import { Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { HabilidadesJugadorService } from './habilidades-jugador.service';

@Controller('api/v1')
export class HabilidadesJugadorController {
  constructor(private readonly service: HabilidadesJugadorService) {}

  @Post('jugadores/:id/habilidades/:habilidadId')
  assign(
    @Param('id', ParseIntPipe) jugadorId: number,
    @Param('habilidadId', ParseIntPipe) habilidadId: number,
  ) {
    return this.service.assign(jugadorId, habilidadId);
  }

  @Delete('jugadores/:id/habilidades/:habilidadId')
  remove(
    @Param('id', ParseIntPipe) jugadorId: number,
    @Param('habilidadId', ParseIntPipe) habilidadId: number,
  ) {
    return this.service.remove(jugadorId, habilidadId);
  }

  @Get('jugadores/:id/habilidades')
  findByJugador(@Param('id', ParseIntPipe) jugadorId: number) {
    return this.service.findByJugador(jugadorId);
  }
}
