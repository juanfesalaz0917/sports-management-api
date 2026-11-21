import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorneosDesarrolloController } from './torneos-desarrollo.controller';
import { TorneosDesarrolloService } from './torneos-desarrollo.service';
import { Torneo } from '../stubs/entities/torneo.entity';
import { Fase } from '../stubs/entities/fase.entity';
import { Partido } from '../partidos/entities/partido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Torneo, Fase, Partido])],
  controllers: [TorneosDesarrolloController],
  providers: [TorneosDesarrolloService],
  exports: [TorneosDesarrolloService],
})
export class TorneosDesarrolloModule {}
