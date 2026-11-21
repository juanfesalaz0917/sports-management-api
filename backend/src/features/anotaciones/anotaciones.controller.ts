import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateAnotacionDto } from './dto/create-anotacion.dto';
import { AnotacionResponseDto } from './dto/anotacion-response.dto';
import { AnotacionesService } from './anotaciones.service';

@Controller('api/v1')
export class AnotacionesController {
  constructor(private readonly service: AnotacionesService) {}

  @Post('partidos/:partidoId/anotaciones')
  create(
    @Param('partidoId', ParseIntPipe) partidoId: number,
    @Body() dto: CreateAnotacionDto,
  ): Promise<AnotacionResponseDto> {
    return this.service.create(partidoId, dto);
  }

  @Get('partidos/:partidoId/anotaciones')
  findByPartido(
    @Param('partidoId', ParseIntPipe) partidoId: number,
  ): Promise<AnotacionResponseDto[]> {
    return this.service.findByPartido(partidoId);
  }

  @Delete('anotaciones/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
