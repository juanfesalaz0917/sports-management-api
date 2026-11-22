import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anotacion } from '../anotaciones/entities/anotacion.entity';
import { EquipoJugador } from '../equipos-jugadores/entities/equipo-jugador.entity';
import { HabilidadJugador } from '../habilidades-jugador/entities/habilidad-jugador.entity';
import { PosicionEspacial } from '../posiciones-espaciales/entities/posicion-espacial.entity';
import { Jugador } from './entities/jugador.entity';
import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';
import { JugadorMapper } from './mappers/jugador.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Jugador,
      PosicionEspacial,
      EquipoJugador,
      HabilidadJugador,
      Anotacion,
    ]),
  ],
  controllers: [JugadoresController],
  providers: [JugadoresService, JugadorMapper],
  exports: [TypeOrmModule, JugadoresService],
})
export class JugadoresModule {}
