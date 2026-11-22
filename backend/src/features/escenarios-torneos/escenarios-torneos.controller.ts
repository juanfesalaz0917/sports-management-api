import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { EscenarioTorneoResponseDto } from './dto/escenario-torneo-response.dto';
import { EscenariosTorneosService } from './escenarios-torneos.service';

@Controller('api/v1')
export class EscenariosTorneosController {
  constructor(private readonly service: EscenariosTorneosService) {}

  @Post('torneos/:torneoId/escenarios/:escenarioId')
  asignar(
    @Param('torneoId', ParseIntPipe) torneoId: number,
    @Param('escenarioId', ParseIntPipe) escenarioId: number,
  ): Promise<EscenarioTorneoResponseDto> {
    return this.service.asignar(torneoId, escenarioId);
  }

  @Delete('torneos/:torneoId/escenarios/:escenarioId')
  quitar(
    @Param('torneoId', ParseIntPipe) torneoId: number,
    @Param('escenarioId', ParseIntPipe) escenarioId: number,
  ) {
    return this.service.quitar(torneoId, escenarioId);
  }

  @Get('torneos/:torneoId/escenarios')
  findByTorneo(
    @Param('torneoId', ParseIntPipe) torneoId: number,
  ): Promise<EscenarioTorneoResponseDto[]> {
    return this.service.findByTorneo(torneoId);
  }

  @Get('escenarios/:escenarioId/torneos')
  findByEscenario(
    @Param('escenarioId', ParseIntPipe) escenarioId: number,
  ): Promise<EscenarioTorneoResponseDto[]> {
    return this.service.findByEscenario(escenarioId);
  }
}
