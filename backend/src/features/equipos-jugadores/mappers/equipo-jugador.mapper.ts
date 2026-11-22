import { Injectable } from '@nestjs/common';
import { hoyISO } from '../../../core/utils/fecha.util';
import { EquipoJugadorResponseDto } from '../dto/equipo-jugador-response.dto';
import { EquipoJugador } from '../entities/equipo-jugador.entity';

/**
 * Vínculo vigente: sin fecha de fin, o con fecha de fin posterior a hoy.
 * La fecha de fin es exclusiva: un jugador retirado hoy (fechaFin = hoy) ya no es vigente.
 */
export function esVigente(v: Pick<EquipoJugador, 'fechaFin'>): boolean {
  return !v.fechaFin || v.fechaFin > hoyISO();
}

@Injectable()
export class EquipoJugadorMapper {
  toResponseDto(entity: EquipoJugador): EquipoJugadorResponseDto {
    const jugador = entity.jugador;
    return {
      id: Number(entity.id),
      equipoId: Number(entity.equipoId),
      equipoNombre: entity.equipo?.nombre,
      jugadorId: Number(entity.jugadorId),
      jugadorNombre: jugador
        ? [jugador.nombre, jugador.apellido].filter(Boolean).join(' ')
        : undefined,
      fechaInicio: entity.fechaInicio ?? null,
      fechaFin: entity.fechaFin ?? null,
      vigente: esVigente(entity),
    };
  }

  toResponseDtoList(entities: EquipoJugador[]): EquipoJugadorResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
