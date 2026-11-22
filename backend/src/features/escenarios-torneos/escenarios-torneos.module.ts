import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { EscenarioTorneo } from './entities/escenario-torneo.entity';
import { EscenariosTorneosController } from './escenarios-torneos.controller';
import { EscenariosTorneosService } from './escenarios-torneos.service';
import { EscenarioTorneoMapper } from './mappers/escenario-torneo.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([EscenarioTorneo, Escenario, Torneo, Partido]),
  ],
  controllers: [EscenariosTorneosController],
  providers: [EscenariosTorneosService, EscenarioTorneoMapper],
  exports: [TypeOrmModule, EscenariosTorneosService],
})
export class EscenariosTorneosModule {}
