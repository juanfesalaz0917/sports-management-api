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
import { CambiarEstadoJugadorDto } from './dto/cambiar-estado-jugador.dto';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { JugadorQueryDto } from './dto/jugador-query.dto';
import {
  JugadorPerfilDto,
  JugadorResponseDto,
} from './dto/jugador-response.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { JugadoresService } from './jugadores.service';

@Controller('api/v1/jugadores')
export class JugadoresController {
  constructor(private readonly service: JugadoresService) {}

  @Post()
  create(@Body() dto: CreateJugadorDto): Promise<JugadorResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() query: JugadorQueryDto,
  ): Promise<PageResponseDto<JugadorResponseDto>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<JugadorResponseDto> {
    return this.service.findOne(id);
  }

  @Get(':id/perfil')
  perfil(@Param('id', ParseIntPipe) id: number): Promise<JugadorPerfilDto> {
    return this.service.perfil(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJugadorDto,
  ): Promise<JugadorResponseDto> {
    return this.service.update(id, dto);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoJugadorDto,
  ): Promise<JugadorResponseDto> {
    return this.service.cambiarEstado(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
