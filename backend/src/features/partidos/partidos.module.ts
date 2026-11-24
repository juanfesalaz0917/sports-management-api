import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../../gateways/notifications/notifications.module';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';
import { Partido } from './entities/partido.entity';
import { PartidoEquipo } from './entities/partido-equipo.entity';
import { Apuesta } from '../apuestas/entities/apuesta.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Fase } from '../fases/entities/fase.entity';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Pelota } from '../pelotas/entities/pelota.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { EquipoJugador } from '../equipos-jugadores/entities/equipo-jugador.entity';
import { PosicionEspacial } from '../posiciones-espaciales/entities/posicion-espacial.entity';
import { PartidoMapper } from './mappers/partido.mapper';
import { PartidoValidator } from './validators/partido.validator';
import { PartidosController } from './partidos.controller';
import { PartidosService } from './partidos.service';
import { PartidoPosicionesService } from './partido-posiciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partido, PartidoEquipo, Apuesta, Torneo, Fase, Escenario, Equipo, Pelota, Jugador, EquipoJugador, PosicionEspacial]),
    NotificationsModule,
  ],
  controllers: [PartidosController],
  providers: [PartidosService, PartidoPosicionesService, PartidoMapper, PartidoValidator, NotificacionesClient],
  exports: [TypeOrmModule, PartidosService, PartidoPosicionesService],
})
export class PartidosModule {}
