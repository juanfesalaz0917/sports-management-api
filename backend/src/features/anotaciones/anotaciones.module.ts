import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../../gateways/notifications/notifications.module';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';
import { Anotacion } from './entities/anotacion.entity';
import { AnotacionMapper } from './mappers/anotacion.mapper';
import { AnotacionesController } from './anotaciones.controller';
import { AnotacionesService } from './anotaciones.service';
import { Partido } from '../partidos/entities/partido.entity';
import { Jugador } from '../stubs/entities/jugador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Anotacion, Partido, Jugador]),
    NotificationsModule,
  ],
  controllers: [AnotacionesController],
  providers: [AnotacionesService, AnotacionMapper, NotificacionesClient],
  exports: [TypeOrmModule, AnotacionesService],
})
export class AnotacionesModule {}
