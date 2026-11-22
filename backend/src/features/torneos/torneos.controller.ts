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
import { CambiarEstadoTorneoDto } from './dto/cambiar-estado-torneo.dto';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { TorneoQueryDto } from './dto/torneo-query.dto';
import {
  EstructuraTorneoDto,
  TorneoResponseDto,
} from './dto/torneo-response.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { TorneosService } from './torneos.service';

@Controller('api/v1/torneos')
export class TorneosController {
  constructor(private readonly service: TorneosService) {}

  @Post()
  create(@Body() dto: CreateTorneoDto): Promise<TorneoResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() query: TorneoQueryDto,
  ): Promise<PageResponseDto<TorneoResponseDto>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TorneoResponseDto> {
    return this.service.findOne(id);
  }

  @Get(':id/estructura')
  estructura(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EstructuraTorneoDto> {
    return this.service.estructura(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTorneoDto,
  ): Promise<TorneoResponseDto> {
    return this.service.update(id, dto);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoTorneoDto,
  ): Promise<TorneoResponseDto> {
    return this.service.cambiarEstado(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
