import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { LocalidadResponseDto } from './dto/localidad-response.dto';
import { LocalidadesService } from './localidades.service';

@Controller('api/v1')
export class LocalidadesController {
  constructor(private readonly service: LocalidadesService) {}

  @Post('localidades')
  create(@Body() dto: CreateLocalidadDto): Promise<LocalidadResponseDto> {
    return this.service.create(dto);
  }

  @Get('escenarios/:escenarioId/localidades')
  findByEscenario(
    @Param('escenarioId', ParseIntPipe) escenarioId: number,
  ): Promise<LocalidadResponseDto[]> {
    return this.service.findByEscenario(escenarioId);
  }

  @Get('localidades/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<LocalidadResponseDto> {
    return this.service.findOne(id);
  }

  @Delete('localidades/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
