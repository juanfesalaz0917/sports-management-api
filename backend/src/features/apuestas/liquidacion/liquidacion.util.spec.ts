import 'reflect-metadata';
import { resolverEstadoApuesta, liquidarApuestas } from './liquidacion.util';
import { Apuesta } from '../entities/apuesta.entity';

const ap = (id: number, equipoId?: number, estado = 'REGISTRADA') =>
  ({ id, equipoId, estado }) as unknown as Apuesta;

describe('Liquidación de apuestas (corrige hallazgo crítico)', () => {
  it('gana solo quien apostó por el equipo ganador', () => {
    expect(resolverEstadoApuesta(10, { ganadorId: 10 })).toBe('GANADA');
    expect(resolverEstadoApuesta(11, { ganadorId: 10 })).toBe('PERDIDA');
  });

  it('compara ids aunque lleguen como string (bigint de MySQL)', () => {
    expect(resolverEstadoApuesta('10' as unknown as number, { ganadorId: 10 })).toBe('GANADA');
  });

  it('empate anula todas las apuestas', () => {
    expect(resolverEstadoApuesta(10, { ganadorId: 10, esEmpate: true })).toBe('ANULADA');
  });

  it('apuesta sin equipo elegido o resultado sin ganador se anula (reembolso)', () => {
    expect(resolverEstadoApuesta(undefined, { ganadorId: 10 })).toBe('ANULADA');
    expect(resolverEstadoApuesta(10, {})).toBe('ANULADA');
  });

  it('liquida un lote mixto correctamente', () => {
    const res = liquidarApuestas([ap(1, 10), ap(2, 11), ap(3, 10), ap(4)], { ganadorId: 10 });
    expect(res.map((a) => a.estado)).toEqual(['GANADA', 'PERDIDA', 'GANADA', 'ANULADA']);
  });
});
