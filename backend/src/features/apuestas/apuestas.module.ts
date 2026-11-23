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
import { PartidoEquipo } from '../partidos/entities/partido-equipo.entity';
import { ApuestaValidator } from './validators/apuesta.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apuesta,
      Aficionado,
      Partido,
      PartidoEquipo,
      MetodoPagoAficionado,
    ]),
    NotificationsModule,
  ],
  controllers: [ApuestasController],
  providers: [ApuestasService, ApuestaMapper, ApuestaValidator, NotificacionesClient],
  exports: [TypeOrmModule, ApuestasService],
})
export class ApuestasModule {}
