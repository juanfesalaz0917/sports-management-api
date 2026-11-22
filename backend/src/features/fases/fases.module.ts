import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaseFinal } from '../fases-finales/entities/fase-final.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Fase } from './entities/fase.entity';
import { FasesController } from './fases.controller';
import { FasesService } from './fases.service';
import { FaseMapper } from './mappers/fase.mapper';
import { FaseValidator } from './validators/fase.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Fase, Torneo, Grupo, FaseFinal, Partido])],
  controllers: [FasesController],
  providers: [FasesService, FaseMapper, FaseValidator],
  exports: [TypeOrmModule, FasesService],
})
export class FasesModule {}
