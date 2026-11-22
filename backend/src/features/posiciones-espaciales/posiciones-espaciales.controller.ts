import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreatePosicionEspacialDto } from './dto/create-posicion.dto';
import { PosicionEspacialResponseDto } from './dto/posicion-response.dto';
import { PosicionesEspacialesService } from './posiciones-espaciales.service';

@Controller('api/v1/posiciones-espaciales')
export class PosicionesEspacialesController {
  constructor(private readonly service: PosicionesEspacialesService) {}

  @Post()
  create(@Body() dto: CreatePosicionEspacialDto): Promise<PosicionEspacialResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<PosicionEspacialResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PosicionEspacialResponseDto> {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
