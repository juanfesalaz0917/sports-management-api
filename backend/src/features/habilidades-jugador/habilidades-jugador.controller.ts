import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { HabilidadesJugadorService } from './habilidades-jugador.service';
import { AsignarHabilidadJugadorDto } from './dto/create-habilidad-jugador.dto';

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

  @Get('habilidades/:id/jugadores')
  findByHabilidad(@Param('id', ParseIntPipe) habilidadId: number) {
    return this.service.findByHabilidad(habilidadId);
  }

  // Alias compatibles con API REST de recursos
  @Post('habilidades-jugador')
  assignBody(@Body() dto: AsignarHabilidadJugadorDto) {
    const jugadorId = dto.jugadorId ?? dto.id_jugador;
    const habilidadId = dto.habilidadId ?? dto.id_habilidad;
    if (!jugadorId || !habilidadId) {
      throw new BadRequestException('jugadorId y habilidadId son obligatorios');
    }
    return this.service.assign(jugadorId, habilidadId);
  }

  @Get('habilidades-jugador/:jugadorId')
  findByJugadorAlias(@Param('jugadorId', ParseIntPipe) jugadorId: number) {
    return this.service.findByJugador(jugadorId);
  }

  @Delete('habilidades-jugador/:jugadorId/:habilidadId')
  removeAlias(
    @Param('jugadorId', ParseIntPipe) jugadorId: number,
    @Param('habilidadId', ParseIntPipe) habilidadId: number,
  ) {
    return this.service.remove(jugadorId, habilidadId);
  }
}
