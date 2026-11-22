import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AficionadosEquiposService } from './aficionados-equipos.service';

@Controller('api/v1')
export class AficionadosEquiposController {
  constructor(private readonly service: AficionadosEquiposService) {}

  @Post('aficionados/:id/equipos/:equipoId')
  assign(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ) {
    return this.service.assign(aficionadoId, equipoId);
  }

  @Delete('aficionados/:id/equipos/:equipoId')
  remove(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ) {
    return this.service.remove(aficionadoId, equipoId);
  }

  @Get('aficionados/:id/equipos')
  findByAficionado(@Param('id', ParseIntPipe) aficionadoId: number) {
    return this.service.findByAficionado(aficionadoId);
  }

  // Rutas directas frontend
  @Post('aficionados-equipos')
  assignDirect(@Body() body: { id_aficionado: number; id_equipo: number }) {
    return this.service.assign(body.id_aficionado, body.id_equipo);
  }

  @Get('aficionados-equipos/:aficionadoId')
  findByAficionadoDirect(@Param('aficionadoId', ParseIntPipe) aficionadoId: number) {
    return this.service.findByAficionado(aficionadoId);
  }

  @Delete('aficionados-equipos/:aficionadoId/:equipoId')
  removeDirect(
    @Param('aficionadoId', ParseIntPipe) aficionadoId: number,
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ) {
    return this.service.remove(aficionadoId, equipoId);
  }
}
