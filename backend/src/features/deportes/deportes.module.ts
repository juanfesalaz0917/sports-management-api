import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { DeportesController } from './deportes.controller';
import { DeportesService } from './deportes.service';
import { Deporte } from './entities/deporte.entity';
import { DeporteMapper } from './mappers/deporte.mapper';
import { DeporteValidator } from './validators/deporte.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Deporte, EquipoDeporte, Torneo])],
  controllers: [DeportesController],
  providers: [DeportesService, DeporteMapper, DeporteValidator],
  exports: [DeportesService, DeporteMapper, TypeOrmModule],
})
export class DeportesModule {}
