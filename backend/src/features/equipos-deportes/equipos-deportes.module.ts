import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deporte } from '../deportes/entities/deporte.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { EquipoDeporte } from './entities/equipo-deporte.entity';
import { EquiposDeportesController } from './equipos-deportes.controller';
import { EquiposDeportesService } from './equipos-deportes.service';
import { EquipoDeporteMapper } from './mappers/equipo-deporte.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([EquipoDeporte, Equipo, Deporte, Inscripcion]),
  ],
  controllers: [EquiposDeportesController],
  providers: [EquiposDeportesService, EquipoDeporteMapper],
  exports: [TypeOrmModule, EquiposDeportesService],
})
export class EquiposDeportesModule {}
