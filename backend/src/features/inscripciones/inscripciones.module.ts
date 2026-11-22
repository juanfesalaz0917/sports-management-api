import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { GrupoEquipo } from '../grupos/entities/grupo-equipo.entity';
import { PartidoEquipo } from '../partidos/entities/partido-equipo.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionMapper } from './mappers/inscripcion.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inscripcion,
      Torneo,
      Equipo,
      EquipoDeporte,
      GrupoEquipo,
      PartidoEquipo,
    ]),
  ],
  controllers: [InscripcionesController],
  providers: [InscripcionesService, InscripcionMapper],
  exports: [TypeOrmModule, InscripcionesService],
})
export class InscripcionesModule {}
