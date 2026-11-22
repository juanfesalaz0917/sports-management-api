import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AgregarEquipoGrupoDto } from './dto/agregar-equipo-grupo.dto';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import {
  GrupoEquipoResponseDto,
  GrupoResponseDto,
} from './dto/grupo-response.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { GruposService } from './grupos.service';

@Controller('api/v1')
export class GruposController {
  constructor(private readonly service: GruposService) {}

  @Post('fases/:faseId/grupos')
  create(
    @Param('faseId', ParseIntPipe) faseId: number,
    @Body() dto: CreateGrupoDto,
  ): Promise<GrupoResponseDto> {
    return this.service.create(faseId, dto);
  }

  @Get('fases/:faseId/grupos')
  findByFase(
    @Param('faseId', ParseIntPipe) faseId: number,
  ): Promise<GrupoResponseDto[]> {
    return this.service.findByFase(faseId);
  }

  @Get('grupos/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GrupoResponseDto> {
    return this.service.findOne(id);
  }

  @Put('grupos/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGrupoDto,
  ): Promise<GrupoResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete('grupos/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get('grupos/:id/equipos')
  findEquipos(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GrupoEquipoResponseDto[]> {
    return this.service.findEquipos(id);
  }

  @Post('grupos/:id/equipos')
  agregarEquipo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AgregarEquipoGrupoDto,
  ): Promise<GrupoEquipoResponseDto> {
    return this.service.agregarEquipo(id, dto.equipoId);
  }

  @Delete('grupos/:id/equipos/:equipoId')
  quitarEquipo(
    @Param('id', ParseIntPipe) id: number,
    @Param('equipoId', ParseIntPipe) equipoId: number,
  ) {
    return this.service.quitarEquipo(id, equipoId);
  }
}
