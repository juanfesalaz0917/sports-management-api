import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PageQueryDto } from '../../core/pagination/page-query.dto';
import { PageResponseDto } from '../../core/pagination/page-response.dto';
import { CreateAficionadoDto } from './dto/create-aficionado.dto';
import { AficionadoResponseDto } from './dto/aficionado-response.dto';
import { UpdateAficionadoDto } from './dto/update-aficionado.dto';
import { AficionadosService } from './aficionados.service';

@Controller('api/v1/aficionados')
export class AficionadosController {
  constructor(private readonly service: AficionadosService) {}

  @Post()
  create(@Body() dto: CreateAficionadoDto): Promise<AficionadoResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: PageQueryDto): Promise<PageResponseDto<AficionadoResponseDto>> {
    return this.service.findAll(query);
  }

  @Get('usuario/:usuarioId')
  findByUsuarioId(@Param('usuarioId', ParseIntPipe) usuarioId: number): Promise<AficionadoResponseDto> {
    return this.service.findOne(usuarioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AficionadoResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAficionadoDto,
  ): Promise<AficionadoResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
