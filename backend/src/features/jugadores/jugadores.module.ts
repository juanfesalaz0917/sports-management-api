import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anotacion } from '../anotaciones/entities/anotacion.entity';
import { EquipoJugador } from '../equipos-jugadores/entities/equipo-jugador.entity';
import { HabilidadJugador } from '../habilidades-jugador/entities/habilidad-jugador.entity';
import { PosicionEspacial } from '../posiciones-espaciales/entities/posicion-espacial.entity';
import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';
import { Jugador } from './entities/jugador.entity';
import { JugadorMapper } from './mappers/jugador.mapper';
import { JugadorValidator } from './validators/jugador.validator';

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
  providers: [JugadoresService, JugadorMapper, JugadorValidator],
  exports: [JugadoresService, JugadorMapper, TypeOrmModule],
})
export class JugadoresModule {}
