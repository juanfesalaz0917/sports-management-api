import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../../gateways/notifications/notifications.module';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';
import { Partido } from './entities/partido.entity';
import { PartidoEquipo } from './entities/partido-equipo.entity';
import { PartidoMapper } from './mappers/partido.mapper';
import { PartidosController } from './partidos.controller';
import { PartidosService } from './partidos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partido, PartidoEquipo]), NotificationsModule],
  controllers: [PartidosController],
  providers: [PartidosService, PartidoMapper, NotificacionesClient],
  exports: [TypeOrmModule, PartidosService],
})
export class PartidosModule {}
