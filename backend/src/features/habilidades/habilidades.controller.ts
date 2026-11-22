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
import { CreateHabilidadDto } from './dto/create-habilidad.dto';
import { HabilidadResponseDto } from './dto/habilidad-response.dto';
import { UpdateHabilidadDto } from './dto/update-habilidad.dto';
import { HabilidadesService } from './habilidades.service';

@Controller('api/v1/habilidades')
export class HabilidadesController {
  constructor(private readonly service: HabilidadesService) {}

  @Post()
  create(@Body() dto: CreateHabilidadDto): Promise<HabilidadResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<HabilidadResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<HabilidadResponseDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHabilidadDto,
  ): Promise<HabilidadResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
