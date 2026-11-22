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
import { CambiarEstadoEscenarioDto } from './dto/cambiar-estado-escenario.dto';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { EscenarioQueryDto } from './dto/escenario-query.dto';
import { EscenarioResponseDto } from './dto/escenario-response.dto';
import { UpdateEscenarioDto } from './dto/update-escenario.dto';
import { EscenariosService } from './escenarios.service';

@Controller('api/v1/escenarios')
export class EscenariosController {
  constructor(private readonly service: EscenariosService) {}

  @Post()
  create(@Body() dto: CreateEscenarioDto): Promise<EscenarioResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() query: EscenarioQueryDto,
  ): Promise<PageResponseDto<EscenarioResponseDto>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EscenarioResponseDto> {
    return this.service.findOne(id);
  }

  @Get(':id/subescenarios')
  findSubescenarios(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EscenarioResponseDto[]> {
    return this.service.findSubescenarios(id);
  }

  @Post(':id/subescenarios')
  createSubescenario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEscenarioDto,
  ): Promise<EscenarioResponseDto> {
    return this.service.createSubescenario(id, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEscenarioDto,
  ): Promise<EscenarioResponseDto> {
    return this.service.update(id, dto);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoEscenarioDto,
  ): Promise<EscenarioResponseDto> {
    return this.service.cambiarEstado(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
