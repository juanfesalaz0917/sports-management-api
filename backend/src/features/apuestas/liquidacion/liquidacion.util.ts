import { Apuesta } from '../entities/apuesta.entity';

export type EstadoLiquidacion = 'GANADA' | 'PERDIDA' | 'ANULADA';

export interface ResultadoPartido {
  ganadorId?: number;
  esEmpate?: boolean;
}

/** Estados en los que una apuesta aún no fue liquidada ni cancelada. */
export const ESTADOS_LIQUIDABLES = ['REGISTRADA', 'PENDIENTE'];

/**
 * Regla de liquidación: se gana solo si el equipo elegido es el ganador.
 * Empate, apuesta sin equipo elegido o resultado sin ganador => ANULADA (reembolso).
 */
export function resolverEstadoApuesta(
  equipoSeleccionadoId: number | null | undefined,
  resultado: ResultadoPartido,
): EstadoLiquidacion {
  if (resultado.esEmpate) return 'ANULADA';
  if (!equipoSeleccionadoId || !resultado.ganadorId) return 'ANULADA';
  return Number(equipoSeleccionadoId) === Number(resultado.ganadorId) ? 'GANADA' : 'PERDIDA';
}

export function liquidarApuestas(apuestas: Apuesta[], resultado: ResultadoPartido): Apuesta[] {
  return apuestas.map((ap) => {
    ap.estado = resolverEstadoApuesta(ap.equipoId, resultado);
    return ap;
  });
}
