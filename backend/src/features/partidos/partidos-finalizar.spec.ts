import 'reflect-metadata';

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
  TypeOrmModule: {},
}));

import { PartidosService } from './partidos.service';
import { PartidoMapper } from './mappers/partido.mapper';

const crear = (partido: unknown, apuestas: unknown[], participa: unknown = { id: 1 }) => {
  const apuestaRepo = {
    find: jest.fn().mockResolvedValue(apuestas),
    save: jest.fn().mockImplementation((x) => Promise.resolve(x)),
  };
  const partidoRepo = {
    findOne: jest.fn().mockResolvedValue(partido),
    save: jest.fn().mockResolvedValue(partido),
  };
  const gateway = { broadcast: jest.fn() };
  const notif = { enviarNotificacion: jest.fn() };
  const service = new PartidosService(
    partidoRepo as never,
    { findOne: jest.fn().mockResolvedValue(participa) } as never,
    apuestaRepo as never,
    new PartidoMapper(),
    gateway as never,
    notif as never,
  );
  return { service, apuestaRepo, partidoRepo, gateway };
};

describe('PartidosService.finalizarPartido', () => {
  it('liquida por equipo elegido y marca el partido FINALIZADO', async () => {
    const apuestas = [
      { id: 1, equipoId: 10, estado: 'REGISTRADA' },
      { id: 2, equipoId: 11, estado: 'REGISTRADA' },
    ];
    const { service, apuestaRepo, partidoRepo, gateway } = crear({ id: 5, estado: 'EN_CURSO' }, apuestas);
    await service.finalizarPartido(5, { id_equipo_ganador: 10 });
    expect(partidoRepo.save).toHaveBeenCalledWith(expect.objectContaining({ estado: 'FINALIZADO' }));
    expect(apuestaRepo.save.mock.calls[0][0].map((a: { estado: string }) => a.estado)).toEqual(['GANADA', 'PERDIDA']);
    expect(gateway.broadcast).toHaveBeenCalledWith('partido_finalizado', expect.anything());
  });

  it('busca apuestas REGISTRADA y PENDIENTE (antes solo PENDIENTE y nunca coincidía)', async () => {
    const { service, apuestaRepo } = crear({ id: 5, estado: 'EN_CURSO' }, []);
    await service.finalizarPartido(5, { id_equipo_ganador: 10 });
    const estado = apuestaRepo.find.mock.calls[0][0].where.estado;
    expect(JSON.stringify(estado)).toContain('REGISTRADA');
    expect(JSON.stringify(estado)).toContain('PENDIENTE');
  });

  it('empate anula todas', async () => {
    const { service, apuestaRepo } = crear({ id: 5, estado: 'EN_CURSO' }, [{ equipoId: 10, estado: 'REGISTRADA' }]);
    await service.finalizarPartido(5, { es_empate: true });
    expect(apuestaRepo.save.mock.calls[0][0][0].estado).toBe('ANULADA');
  });

  it('no permite finalizar dos veces', async () => {
    const { service } = crear({ id: 5, estado: 'FINALIZADO' }, []);
    await expect(service.finalizarPartido(5, { id_equipo_ganador: 10 })).rejects.toThrow('ya está FINALIZADO');
  });

  it('rechaza ganador que no participa en el partido', async () => {
    const { service } = crear({ id: 5, estado: 'EN_CURSO' }, [], null);
    await expect(service.finalizarPartido(5, { id_equipo_ganador: 99 })).rejects.toThrow('no participa');
  });

  it('partido inexistente => NotFound', async () => {
    const { service } = crear(null, []);
    await expect(service.finalizarPartido(1, {})).rejects.toThrow('no encontrado');
  });
});
