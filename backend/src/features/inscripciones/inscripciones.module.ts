import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { GrupoEquipo } from '../grupos/entities/grupo-equipo.entity';
import { PartidoEquipo } from '../partidos/entities/partido-equipo.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionMapper } from './mappers/inscripcion.mapper';
import { InscripcionValidator } from './validators/inscripcion.validator';

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
  providers: [InscripcionesService, InscripcionMapper, InscripcionValidator],
  exports: [InscripcionesService, InscripcionMapper, TypeOrmModule],
})
export class InscripcionesModule {}
