import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fase } from '../fases/entities/fase.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { FaseFinal } from './entities/fase-final.entity';
import { FasesFinalesController } from './fases-finales.controller';
import { FasesFinalesService } from './fases-finales.service';
import { FaseFinalMapper } from './mappers/fase-final.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([FaseFinal, Fase, Torneo, Partido])],
  controllers: [FasesFinalesController],
  providers: [FasesFinalesService, FaseFinalMapper],
  exports: [TypeOrmModule, FasesFinalesService],
})
export class FasesFinalesModule {}
