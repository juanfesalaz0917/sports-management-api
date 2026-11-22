import { Injectable } from '@nestjs/common';
import {
  GrupoEquipoResponseDto,
  GrupoResponseDto,
} from '../dto/grupo-response.dto';
import { GrupoEquipo } from '../entities/grupo-equipo.entity';
import { Grupo } from '../entities/grupo.entity';

@Injectable()
export class GrupoMapper {
  toResponseDto(entity: Grupo, totalEquipos?: number): GrupoResponseDto {
    return {
      id: Number(entity.id),
      faseId: Number(entity.faseId),
      faseNombre: entity.fase?.nombre,
      nombreGrupo: entity.nombreGrupo ?? undefined,
      totalEquipos,
    };
  }

  toEquipoResponseDto(entity: GrupoEquipo): GrupoEquipoResponseDto {
    return {
      grupoId: Number(entity.grupoId),
      faseId: Number(entity.faseId),
      equipoId: Number(entity.equipoId),
      equipoNombre: entity.equipo?.nombre,
    };
  }

  toEquipoResponseDtoList(entities: GrupoEquipo[]): GrupoEquipoResponseDto[] {
    return entities.map((e) => this.toEquipoResponseDto(e));
  }
}
