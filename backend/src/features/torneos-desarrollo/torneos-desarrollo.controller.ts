import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DesarrolloTorneoResponseDto } from './dto/desarrollo-torneo-response.dto';
import { TorneosDesarrolloService } from './torneos-desarrollo.service';

@Controller('api/v1/torneos')
export class TorneosDesarrolloController {
  constructor(private readonly service: TorneosDesarrolloService) {}

  @Get(':id/desarrollo')
  consultarDesarrollo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DesarrolloTorneoResponseDto> {
    return this.service.consultarDesarrollo(id);
  }
}
