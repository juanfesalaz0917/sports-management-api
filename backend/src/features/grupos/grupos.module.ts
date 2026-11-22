import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Fase } from '../fases/entities/fase.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { GruposController } from './grupos.controller';
import { GruposService } from './grupos.service';
import { GrupoEquipo } from './entities/grupo-equipo.entity';
import { Grupo } from './entities/grupo.entity';
import { GrupoMapper } from './mappers/grupo.mapper';
import { GrupoValidator } from './validators/grupo.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, GrupoEquipo, Fase, Equipo, Inscripcion])],
  controllers: [GruposController],
  providers: [GruposService, GrupoMapper, GrupoValidator],
  exports: [GruposService, GrupoMapper, TypeOrmModule],
})
export class GruposModule {}
