import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deporte } from './entities/deporte.entity';
import { Equipo } from './entities/equipo.entity';
import { Torneo } from './entities/torneo.entity';
import { Fase } from './entities/fase.entity';
import { Escenario } from './entities/escenario.entity';
import { Jugador } from './entities/jugador.entity';
import { Habilidad } from './entities/habilidad.entity';
import { MetodoPago } from './entities/metodo-pago.entity';
import { StubsService } from './stubs.service';
import { StubsController } from './stubs.controller';

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
    ]),
  ],
  providers: [StubsService],
  controllers: [StubsController],
  exports: [TypeOrmModule, StubsService],
})
export class StubsModule {}
