import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { EquipoJugador } from '../equipos-jugadores/entities/equipo-jugador.entity';
import { GrupoEquipo } from '../grupos/entities/grupo-equipo.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { PartidoEquipo } from '../partidos/entities/partido-equipo.entity';
import { Equipo } from './entities/equipo.entity';
import { EquiposController } from './equipos.controller';
import { EquiposService } from './equipos.service';
import { EquipoMapper } from './mappers/equipo.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Equipo,
      EquipoDeporte,
      EquipoJugador,
      Inscripcion,
      GrupoEquipo,
      PartidoEquipo,
    ]),
  ],
  controllers: [EquiposController],
  providers: [EquiposService, EquipoMapper],
  exports: [TypeOrmModule, EquiposService],
})
export class EquiposModule {}
