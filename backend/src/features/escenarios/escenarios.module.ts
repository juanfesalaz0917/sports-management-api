import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscenarioTorneo } from '../escenarios-torneos/entities/escenario-torneo.entity';
import { Localidad } from '../localidades/entities/localidad.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { EscenariosController } from './escenarios.controller';
import { EscenariosService } from './escenarios.service';
import { Escenario } from './entities/escenario.entity';
import { EscenarioMapper } from './mappers/escenario.mapper';
import { EscenarioValidator } from './validators/escenario.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Escenario, Localidad, Partido, EscenarioTorneo])],
  controllers: [EscenariosController],
  providers: [EscenariosService, EscenarioMapper, EscenarioValidator],
  exports: [EscenariosService, EscenarioMapper, TypeOrmModule],
})
export class EscenariosModule {}
