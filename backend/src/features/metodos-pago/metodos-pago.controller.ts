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
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { MetodoPagoResponseDto } from './dto/metodo-pago-response.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { MetodosPagoService } from './metodos-pago.service';

@Controller('api/v1/metodos-pago')
export class MetodosPagoController {
  constructor(private readonly service: MetodosPagoService) {}

  @Post()
  create(@Body() dto: CreateMetodoPagoDto): Promise<MetodoPagoResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<MetodoPagoResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MetodoPagoResponseDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMetodoPagoDto,
  ): Promise<MetodoPagoResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
