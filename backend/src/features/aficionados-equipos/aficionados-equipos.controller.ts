import { Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AficionadosEquiposService } from './aficionados-equipos.service';

@Controller('api/v1/aficionados/:id/equipos')
export class AficionadosEquiposController {
  constructor(private readonly service: AficionadosEquiposService) { }

  @Post(':equipoId')
  assign(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ) {
    return this.service.assign(aficionadoId, equipoId);
  }

  @Delete(':equipoId')
  remove(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ) {
    return this.service.remove(aficionadoId, equipoId);
  }

  @Get()
  findByAficionado(@Param('id', ParseIntPipe) aficionadoId: number) {
    return this.service.findByAficionado(aficionadoId);
  }
}
