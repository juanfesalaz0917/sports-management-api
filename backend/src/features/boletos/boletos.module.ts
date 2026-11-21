import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleto } from './entities/boleto.entity';
import { BoletoMapper } from './mappers/boleto.mapper';
import { BoletosController } from './boletos.controller';
import { BoletosService } from './boletos.service';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { Localidad } from '../localidades/entities/localidad.entity';
import { Partido } from '../partidos/entities/partido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boleto, Aficionado, Localidad, Partido])],
  controllers: [BoletosController],
  providers: [BoletosService, BoletoMapper],
  exports: [TypeOrmModule, BoletosService],
})
export class BoletosModule {}
