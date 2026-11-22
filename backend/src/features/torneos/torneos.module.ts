import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deporte } from '../deportes/entities/deporte.entity';
import { Fase } from '../fases/entities/fase.entity';
import { FaseFinal } from '../fases-finales/entities/fase-final.entity';
import { GrupoEquipo } from '../grupos/entities/grupo-equipo.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { TorneosController } from './torneos.controller';
import { TorneosService } from './torneos.service';
import { Torneo } from './entities/torneo.entity';
import { TorneoMapper } from './mappers/torneo.mapper';
import { TorneoEstructuraService } from './torneo-estructura.service';
import { TorneoValidator } from './validators/torneo.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Torneo,
      Deporte,
      Fase,
      Inscripcion,
      Partido,
      Grupo,
      GrupoEquipo,
      FaseFinal,
    ]),
  ],
  controllers: [TorneosController],
  providers: [
    TorneosService,
    TorneoMapper,
    TorneoValidator,
    TorneoEstructuraService,
  ],
  exports: [TorneosService, TorneoMapper, TypeOrmModule],
})
export class TorneosModule {}
