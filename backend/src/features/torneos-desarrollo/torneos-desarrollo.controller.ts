import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DesarrolloTorneoResponseDto } from './dto/desarrollo-torneo-response.dto';
import { TorneosDesarrolloService } from './torneos-desarrollo.service';

@Controller('api/v1')
export class TorneosDesarrolloController {
  constructor(private readonly service: TorneosDesarrolloService) {}

  @Get('torneos/:id/desarrollo')
  consultarDesarrollo(@Param('id', ParseIntPipe) id: number): Promise<DesarrolloTorneoResponseDto> {
    return this.service.consultarDesarrollo(id);
  }

  @Get('torneos-desarrollo/:id/desarrollo')
  consultarDesarrolloAlias(@Param('id', ParseIntPipe) id: number): Promise<DesarrolloTorneoResponseDto> {
    return this.service.consultarDesarrollo(id);
  }

  @Get('torneos/:id/tabla-posiciones')
  consultarTablaPosiciones(@Param('id', ParseIntPipe) id: number) {
    return this.service.consultarTabla(id);
  }

  @Get('torneos-desarrollo/:id/tabla-posiciones')
  consultarTablaPosicionesAlias(@Param('id', ParseIntPipe) id: number) {
    return this.service.consultarTabla(id);
  }
}
