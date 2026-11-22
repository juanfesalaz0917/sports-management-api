import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Fase } from '../fases/entities/fase.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { GrupoEquipo } from './entities/grupo-equipo.entity';
import { Grupo } from './entities/grupo.entity';
import { GruposController } from './grupos.controller';
import { GruposService } from './grupos.service';
import { GrupoMapper } from './mappers/grupo.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grupo, GrupoEquipo, Fase, Equipo, Inscripcion]),
  ],
  controllers: [GruposController],
  providers: [GruposService, GrupoMapper],
  exports: [TypeOrmModule, GruposService],
})
export class GruposModule {}
