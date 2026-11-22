import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StubsService } from './stubs.service';

@Controller('api/v1/stubs')
export class StubsController {
  constructor(private readonly stubsService: StubsService) {}

  @Post('seed')
  seed() {
    return this.stubsService.seedDemoData();
  }

  @Get('health')
  health() {
    return { status: 'ok', modulo: 'stubs-a-c' };
  }

  @Get('torneos')
  getTorneos() {
    return this.stubsService.getTorneos();
  }

  @Get('fases/:torneoId')
  getFases(@Param('torneoId', ParseIntPipe) torneoId: number) {
    return this.stubsService.getFases(torneoId);
  }

  @Get('escenarios')
  getEscenarios() {
    return this.stubsService.getEscenarios();
  }

  @Get('equipos')
  getEquipos() {
    return this.stubsService.getEquipos();
  }

  @Get('jugadores')
  getJugadores() {
    return this.stubsService.getJugadores();
  }

  @Get('pelotas')
  getPelotas() {
    return this.stubsService.getPelotas();
  }

  @Get('habilidades')
  getHabilidades() {
    return this.stubsService.getHabilidades();
  }

  @Get('metodos-pago')
  getMetodosPago() {
    return this.stubsService.getMetodosPago();
  }
}
