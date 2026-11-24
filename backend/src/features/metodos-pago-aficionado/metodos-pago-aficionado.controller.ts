import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateMetodoPagoAficionadoDto } from './dto/create-metodo-pago-aficionado.dto';
import { MetodoPagoAficionadoResponseDto } from './dto/metodo-pago-aficionado-response.dto';
import { MetodosPagoAficionadoService } from './metodos-pago-aficionado.service';

@Controller('api/v1')
export class MetodosPagoAficionadoController {
  constructor(private readonly service: MetodosPagoAficionadoService) {}

  @Post('aficionados/:id/metodos-pago')
  create(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Body() dto: CreateMetodoPagoAficionadoDto,
  ): Promise<MetodoPagoAficionadoResponseDto> {
    return this.service.create(aficionadoId, dto);
  }

  @Get('aficionados/:id/metodos-pago')
  findByAficionado(
    @Param('id', ParseIntPipe) aficionadoId: number,
  ): Promise<MetodoPagoAficionadoResponseDto[]> {
    return this.service.findByAficionado(aficionadoId);
  }

  @Put('aficionados/:id/metodos-pago/:mpId')
  update(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Param('mpId', ParseIntPipe) mpId: number,
    @Body() dto: CreateMetodoPagoAficionadoDto,
  ) {
    return this.service.update(aficionadoId, mpId, dto);
  }

  @Delete('aficionados/:id/metodos-pago/:mpId')
  remove(
    @Param('id', ParseIntPipe) aficionadoId: number,
    @Param('mpId', ParseIntPipe) mpId: number,
  ) {
    return this.service.remove(aficionadoId, mpId);
  }

  // Rutas directas compatibles con el frontend
  @Post('metodos-pago-aficionado')
  createDirect(@Body() body: { id_aficionado: number; id_metodo_pago: number; referencia: string }) {
    return this.service.create(body.id_aficionado, {
      metodoPagoId: body.id_metodo_pago,
      referencia: body.referencia,
    });
  }

  @Get('metodos-pago-aficionado/:aficionadoId')
  findByAficionadoDirect(@Param('aficionadoId', ParseIntPipe) aficionadoId: number) {
    return this.service.findByAficionado(aficionadoId);
  }

  @Delete('metodos-pago-aficionado/:id')
  removeDirect(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeById(id);
  }
}
