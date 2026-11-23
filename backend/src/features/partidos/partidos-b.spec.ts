import 'reflect-metadata';

// @nestjs/typeorm se distribuye como ESM; se simula solo el decorador para aislar la prueba.
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
  TypeOrmModule: {},
}));

import { PartidosService } from './partidos.service';
import { PartidosController } from './partidos.controller';
import { PartidoMapper } from './mappers/partido.mapper';
import { ApuestasController } from '../apuestas/apuestas.controller';

const route = (proto: object, key: string) => ({
  path: Reflect.getMetadata('path', (proto as Record<string, object>)[key]),
  method: Reflect.getMetadata('method', (proto as Record<string, object>)[key]),
});

describe('Participante B - contratos HTTP', () => {
  it('GET fases/:faseId/partidos existe', () => {
    expect(route(PartidosController.prototype, 'findByFase').path).toBe('fases/:faseId/partidos');
  });

  it('PUT partidos/:id/resultado existe (RequestMethod.PUT = 2)', () => {
    const r = route(PartidosController.prototype, 'actualizarResultado');
    expect(r.path).toBe('partidos/:id/resultado');
    expect(r.method).toBe(2);
  });

  it('POST partidos/:id/resultado se mantiene (compatibilidad)', () => {
    expect(route(PartidosController.prototype, 'registrarResultado').method).toBe(1);
  });

  it('POST y PATCH apuestas/:id/cancelar coexisten', () => {
    expect(route(ApuestasController.prototype, 'cancelarPost').method).toBe(1);
    expect(route(ApuestasController.prototype, 'cancelar').method).toBe(4);
  });
});

describe('PartidosService.findByFase', () => {
  it('filtra por faseId y mapea equipos', async () => {
    const find = jest.fn().mockResolvedValue([
      {
        id: 1,
        fechaHora: new Date(),
        estado: 'PROGRAMADO',
        torneoId: 1,
        faseId: 5,
        escenarioId: 2,
        equipos: [
          { rol: 'LOCAL', equipoId: 10, equipo: { nombre: 'A' } },
          { rol: 'VISITANTE', equipoId: 11, equipo: { nombre: 'B' } },
        ],
      },
    ]);
    const service = new PartidosService(
      { find } as never,
      {} as never,
      {} as never,
      new PartidoMapper(),
      {} as never,
      {} as never,
    );
    const res = await service.findByFase(5);
    expect(find.mock.calls[0][0].where).toEqual({ faseId: 5 });
    expect(res).toHaveLength(1);
    expect(res[0].equipoLocalNombre).toBe('A');
    expect(res[0].equipoVisitanteId).toBe(11);
  });

  it('devuelve lista vacía si la fase no tiene partidos', async () => {
    const service = new PartidosService(
      { find: jest.fn().mockResolvedValue([]) } as never,
      {} as never,
      {} as never,
      new PartidoMapper(),
      {} as never,
      {} as never,
    );
    await expect(service.findByFase(99)).resolves.toEqual([]);
  });
});
