import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateApuestaDto } from './dto/create-apuesta.dto';
import { ApuestaResponseDto } from './dto/apuesta-response.dto';
import { ApuestasService } from './apuestas.service';

@Controller('api/v1')
export class ApuestasController {
  constructor(private readonly service: ApuestasService) {}

  @Post('apuestas')
  create(@Body() dto: CreateApuestaDto): Promise<ApuestaResponseDto> {
    return this.service.create(dto);
  }

  @Get('aficionados/:id/apuestas')
  findByAficionado(
    @Param('id', ParseIntPipe) aficionadoId: number,
  ): Promise<ApuestaResponseDto[]> {
    return this.service.findByAficionado(aficionadoId);
  }

  @Get('partidos/:id/apuestas')
  findByPartido(
    @Param('id', ParseIntPipe) partidoId: number,
  ): Promise<ApuestaResponseDto[]> {
    return this.service.findByPartido(partidoId);
  }

  @Post('apuestas/:id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number): Promise<ApuestaResponseDto> {
    return this.service.cancelar(id);
  }

  @Post('partidos/:id/liquidar-apuestas')
  liquidar(@Param('id', ParseIntPipe) id: number) {
    return this.service.liquidar(id);
  }
}
