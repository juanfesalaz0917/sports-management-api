import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../../gateways/notifications/notifications.module';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';
import { Apuesta } from './entities/apuesta.entity';
import { ApuestaMapper } from './mappers/apuesta.mapper';
import { ApuestasController } from './apuestas.controller';
import { ApuestasService } from './apuestas.service';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { MetodoPagoAficionado } from '../metodos-pago-aficionado/entities/metodo-pago-aficionado.entity';
import { Partido } from '../partidos/entities/partido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apuesta,
      Aficionado,
      Partido,
      MetodoPagoAficionado,
    ]),
    NotificationsModule,
  ],
  controllers: [ApuestasController],
  providers: [ApuestasService, ApuestaMapper, NotificacionesClient],
  exports: [TypeOrmModule, ApuestasService],
})
export class ApuestasModule {}
