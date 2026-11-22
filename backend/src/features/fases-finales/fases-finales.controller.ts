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
import {
  CreateFaseFinalDto,
  FaseFinalResponseDto,
  UpdateFaseFinalDto,
} from './dto/fase-final.dto';
import { FasesFinalesService } from './fases-finales.service';

@Controller('api/v1/torneos/:torneoId/fase-final')
export class FasesFinalesController {
  constructor(private readonly service: FasesFinalesService) {}

  @Post()
  create(
    @Param('torneoId', ParseIntPipe) torneoId: number,
    @Body() dto: CreateFaseFinalDto,
  ): Promise<FaseFinalResponseDto> {
    return this.service.create(torneoId, dto);
  }

  @Get()
  findByTorneo(
    @Param('torneoId', ParseIntPipe) torneoId: number,
  ): Promise<FaseFinalResponseDto> {
    return this.service.findByTorneo(torneoId);
  }

  @Put()
  update(
    @Param('torneoId', ParseIntPipe) torneoId: number,
    @Body() dto: UpdateFaseFinalDto,
  ): Promise<FaseFinalResponseDto> {
    return this.service.update(torneoId, dto);
  }

  @Delete()
  remove(@Param('torneoId', ParseIntPipe) torneoId: number) {
    return this.service.remove(torneoId);
  }
}
