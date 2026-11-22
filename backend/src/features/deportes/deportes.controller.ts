import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PageResponseDto } from '../../core/pagination/page-response.dto';
import { DeportesService } from './deportes.service';
import { CambiarEstadoDeporteDto } from './dto/cambiar-estado-deporte.dto';
import { CreateDeporteDto } from './dto/create-deporte.dto';
import { DeporteQueryDto } from './dto/deporte-query.dto';
import { DeporteResponseDto } from './dto/deporte-response.dto';
import { UpdateDeporteDto } from './dto/update-deporte.dto';

@Controller('api/v1/deportes')
export class DeportesController {
  constructor(private readonly service: DeportesService) {}

  @Post()
  create(@Body() dto: CreateDeporteDto): Promise<DeporteResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() query: DeporteQueryDto,
  ): Promise<PageResponseDto<DeporteResponseDto>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DeporteResponseDto> {
    return this.service.findOne(id);
  }

  @Get(':id/subdeportes')
  findSubdeportes(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeporteResponseDto[]> {
    return this.service.findSubdeportes(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeporteDto,
  ): Promise<DeporteResponseDto> {
    return this.service.update(id, dto);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoDeporteDto,
  ): Promise<DeporteResponseDto> {
    return this.service.cambiarEstado(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
