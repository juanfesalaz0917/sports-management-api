import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../../gateways/notifications/notifications.module';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';
import { Partido } from './entities/partido.entity';
import { PartidoEquipo } from './entities/partido-equipo.entity';
import { Apuesta } from '../apuestas/entities/apuesta.entity';
import { PartidoMapper } from './mappers/partido.mapper';
import { PartidosController } from './partidos.controller';
import { PartidosService } from './partidos.service';
import { PartidoPosicionesService } from './partido-posiciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partido, PartidoEquipo, Apuesta]), NotificationsModule],
  controllers: [PartidosController],
  providers: [PartidosService, PartidoPosicionesService, PartidoMapper, NotificacionesClient],
  exports: [TypeOrmModule, PartidosService, PartidoPosicionesService],
})
export class PartidosModule {}
