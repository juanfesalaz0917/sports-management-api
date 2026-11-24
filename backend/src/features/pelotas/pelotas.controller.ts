import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PageQueryDto } from '../../core/pagination/page-query.dto';
import { PageResponseDto } from '../../core/pagination/page-response.dto';
import { CreatePelotaDto } from './dto/create-pelota.dto';
import { PelotaResponseDto } from './dto/pelota-response.dto';
import { UpdatePelotaDto } from './dto/update-pelota.dto';
import { PelotasService } from './pelotas.service';

@Controller('api/v1/pelotas')
export class PelotasController {
  constructor(private readonly service: PelotasService) {}

  @Post()
  create(@Body() dto: CreatePelotaDto): Promise<PelotaResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: PageQueryDto): Promise<PageResponseDto<PelotaResponseDto>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PelotaResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePelotaDto,
  ): Promise<PelotaResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
