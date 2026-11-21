import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { PartidoResponseDto } from './dto/partido-response.dto';
import { UpdatePartidoEstadoDto } from './dto/update-partido-estado.dto';
import { PartidosService } from './partidos.service';

@Controller('api/v1/partidos')
export class PartidosController {
  constructor(private readonly service: PartidosService) {}

  @Post()
  create(@Body() dto: CreatePartidoDto): Promise<PartidoResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('torneoId') torneoId?: string): Promise<PartidoResponseDto[]> {
    return this.service.findAll(torneoId ? parseInt(torneoId, 10) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PartidoResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartidoEstadoDto,
  ): Promise<PartidoResponseDto> {
    return this.service.updateEstado(id, dto);
  }
}
