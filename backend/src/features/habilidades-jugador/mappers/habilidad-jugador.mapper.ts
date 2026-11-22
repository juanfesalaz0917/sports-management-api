import { Injectable } from '@nestjs/common';
import { HabilidadJugador } from '../entities/habilidad-jugador.entity';

export interface HabilidadJugadorResponse {
  jugadorId: number;
  jugadorNombre?: string;
  habilidadId: number;
  habilidadNombre?: string;
}

@Injectable()
export class HabilidadJugadorMapper {
  toResponseDto(entity: HabilidadJugador): HabilidadJugadorResponse {
    return {
      jugadorId: Number(entity.jugadorId),
      jugadorNombre: entity.jugador?.nombre,
      habilidadId: Number(entity.habilidadId),
      habilidadNombre: entity.habilidad?.nombre,
    };
  }

  toResponseDtoList(entities: HabilidadJugador[]): HabilidadJugadorResponse[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
