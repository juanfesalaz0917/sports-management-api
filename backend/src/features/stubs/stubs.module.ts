import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelota } from '../pelotas/entities/pelota.entity';
import { Deporte } from './entities/deporte.entity';
import { Equipo } from './entities/equipo.entity';
import { Escenario } from './entities/escenario.entity';
import { Fase } from './entities/fase.entity';
import { Habilidad } from './entities/habilidad.entity';
import { Jugador } from './entities/jugador.entity';
import { MetodoPago } from './entities/metodo-pago.entity';
import { Torneo } from './entities/torneo.entity';
import { StubsController } from './stubs.controller';
import { StubsService } from './stubs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Deporte,
      Equipo,
      Torneo,
      Fase,
      Escenario,
      Jugador,
      Habilidad,
      MetodoPago,
      Pelota,
    ]),
  ],
  providers: [StubsService],
  controllers: [StubsController],
  exports: [TypeOrmModule, StubsService],
})
export class StubsModule {}
