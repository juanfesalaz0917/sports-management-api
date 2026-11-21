import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { BoletoResponseDto } from './dto/boleto-response.dto';
import { BoletosService } from './boletos.service';

@Controller('api/v1')
export class BoletosController {
  constructor(private readonly service: BoletosService) {}

  @Post('boletos')
  create(@Body() dto: CreateBoletoDto): Promise<BoletoResponseDto> {
    return this.service.create(dto);
  }

  @Get('partidos/:partidoId/boletos')
  findByPartido(
    @Param('partidoId', ParseIntPipe) partidoId: number,
  ): Promise<BoletoResponseDto[]> {
    return this.service.findByPartido(partidoId);
  }

  @Get('boletos/partido/:partidoId')
  findByPartidoAlias(
    @Param('partidoId', ParseIntPipe) partidoId: number,
  ): Promise<BoletoResponseDto[]> {
    return this.service.findByPartido(partidoId);
  }

  @Get('aficionados/:aficionadoId/boletos')
  findByAficionado(
    @Param('aficionadoId', ParseIntPipe) aficionadoId: number,
  ): Promise<BoletoResponseDto[]> {
    return this.service.findByAficionado(aficionadoId);
  }

  @Patch('boletos/:id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { estado: string },
  ) {
    return this.service.updateEstado(id, dto.estado);
  }
}
