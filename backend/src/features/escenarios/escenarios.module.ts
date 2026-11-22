import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscenarioTorneo } from '../escenarios-torneos/entities/escenario-torneo.entity';
import { Localidad } from '../localidades/entities/localidad.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Escenario } from './entities/escenario.entity';
import { EscenariosController } from './escenarios.controller';
import { EscenariosService } from './escenarios.service';
import { EscenarioMapper } from './mappers/escenario.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Escenario, Localidad, Partido, EscenarioTorneo]),
  ],
  controllers: [EscenariosController],
  providers: [EscenariosService, EscenarioMapper],
  exports: [TypeOrmModule, EscenariosService],
})
export class EscenariosModule {}
