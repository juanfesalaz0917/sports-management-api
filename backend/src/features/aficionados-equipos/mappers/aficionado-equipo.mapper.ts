import { Injectable } from '@nestjs/common';
import { AficionadoEquipo } from '../entities/aficionado-equipo.entity';

export interface AficionadoEquipoResponse {
  aficionadoId: number;
  equipoId: number;
  equipoNombre?: string;
}

@Injectable()
export class AficionadoEquipoMapper {
  toResponseDto(entity: AficionadoEquipo): AficionadoEquipoResponse {
    return {
      aficionadoId: Number(entity.aficionadoId),
      equipoId: Number(entity.equipoId),
      equipoNombre: entity.equipo?.nombre,
    };
  }

  toResponseDtoList(entities: AficionadoEquipo[]): AficionadoEquipoResponse[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
