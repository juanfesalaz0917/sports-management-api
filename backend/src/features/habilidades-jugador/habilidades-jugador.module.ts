import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabilidadJugador } from './entities/habilidad-jugador.entity';
import { HabilidadesJugadorController } from './habilidades-jugador.controller';
import { HabilidadesJugadorService } from './habilidades-jugador.service';
import { Habilidad } from '../habilidades/entities/habilidad.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HabilidadJugador, Jugador, Habilidad])],
  controllers: [HabilidadesJugadorController],
  providers: [HabilidadesJugadorService],
  exports: [TypeOrmModule, HabilidadesJugadorService],
})
export class HabilidadesJugadorModule {}
