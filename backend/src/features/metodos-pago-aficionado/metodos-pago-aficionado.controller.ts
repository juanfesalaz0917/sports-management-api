import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateMetodoPagoAficionadoDto } from './dto/create-metodo-pago-aficionado.dto';
import { MetodoPagoAficionadoResponseDto } from './dto/metodo-pago-aficionado-response.dto';
import { MetodosPagoAficionadoService } from './metodos-pago-aficionado.service';

@Controller('api/v1/aficionados/:id/metodos-pago')
export class MetodosPagoAficionadoController {
  constructor(private readonly service: MetodosPagoAficionadoService) {}

  @Post()
  create(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Body() dto: CreateMetodoPagoAficionadoDto,
  ): Promise<MetodoPagoAficionadoResponseDto> {
    return this.service.create(aficionadoId, dto);
  }

  @Get()
  findByAficionado(
    @Param('id', ParseIntPipe) aficionadoId: number,
  ): Promise<MetodoPagoAficionadoResponseDto[]> {
    return this.service.findByAficionado(aficionadoId);
  }

  @Delete(':mpId')
  remove(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Param('mpId', ParseIntPipe) mpId: number,
  ) {
    return this.service.remove(aficionadoId, mpId);
  }
}
