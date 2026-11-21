import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
  findAll(): Promise<AficionadoResponseDto[]> {
    return this.service.findAll();
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
