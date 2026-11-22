import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { EquipoJugador } from './entities/equipo-jugador.entity';
import { EquiposJugadoresController } from './equipos-jugadores.controller';
import { EquiposJugadoresService } from './equipos-jugadores.service';
import { EquipoJugadorMapper } from './mappers/equipo-jugador.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([EquipoJugador, Equipo, Jugador])],
  controllers: [EquiposJugadoresController],
  providers: [EquiposJugadoresService, EquipoJugadorMapper],
  exports: [TypeOrmModule, EquiposJugadoresService],
})
export class EquiposJugadoresModule {}
