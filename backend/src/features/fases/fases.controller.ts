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
import { CreateFaseDto } from './dto/create-fase.dto';
import { FaseResponseDto } from './dto/fase-response.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';
import { FasesService } from './fases.service';

@Controller('api/v1')
export class FasesController {
  constructor(private readonly service: FasesService) {}

  @Post('torneos/:torneoId/fases')
  create(
    @Param('torneoId', ParseIntPipe) torneoId: number,
    @Body() dto: CreateFaseDto,
  ): Promise<FaseResponseDto> {
    return this.service.create(torneoId, dto);
  }

  @Get('torneos/:torneoId/fases')
  findByTorneo(
    @Param('torneoId', ParseIntPipe) torneoId: number,
  ): Promise<FaseResponseDto[]> {
    return this.service.findByTorneo(torneoId);
  }

  @Get('fases/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FaseResponseDto> {
    return this.service.findOne(id);
  }

  @Put('fases/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFaseDto,
  ): Promise<FaseResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete('fases/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
