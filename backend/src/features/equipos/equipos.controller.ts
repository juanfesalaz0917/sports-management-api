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
import { CambiarEstadoEquipoDto } from './dto/cambiar-estado-equipo.dto';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { EquipoQueryDto } from './dto/equipo-query.dto';
import { EquipoResponseDto } from './dto/equipo-response.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { EquiposService } from './equipos.service';

@Controller('api/v1/equipos')
export class EquiposController {
  constructor(private readonly service: EquiposService) {}

  @Post()
  create(@Body() dto: CreateEquipoDto): Promise<EquipoResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() query: EquipoQueryDto,
  ): Promise<PageResponseDto<EquipoResponseDto>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EquipoResponseDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipoDto,
  ): Promise<EquipoResponseDto> {
    return this.service.update(id, dto);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoEquipoDto,
  ): Promise<EquipoResponseDto> {
    return this.service.cambiarEstado(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
