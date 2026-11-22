import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habilidad } from './entities/habilidad.entity';
import { HabilidadesController } from './habilidades.controller';
import { HabilidadesService } from './habilidades.service';
import { HabilidadJugador } from '../habilidades-jugador/entities/habilidad-jugador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habilidad, HabilidadJugador])],
  controllers: [HabilidadesController],
  providers: [HabilidadesService],
  exports: [HabilidadesService, TypeOrmModule],
})
export class HabilidadesModule {}
