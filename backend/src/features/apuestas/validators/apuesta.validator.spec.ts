import 'reflect-metadata';

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
  TypeOrmModule: {},
}));

import { ApuestaValidator } from './apuesta.validator';
import { ApuestasService } from '../apuestas.service';
import { ApuestaMapper } from '../mappers/apuesta.mapper';
import { Apuesta } from '../entities/apuesta.entity';
import { CreateApuestaDto } from '../dto/create-apuesta.dto';

const repo = (v: unknown) => ({ findOne: jest.fn().mockResolvedValue(v) }) as never;
const dto = { aficionadoId: 1, partidoId: 2, equipoId: 10, metodoAficionadoId: 3, monto: 50 } as CreateApuestaDto;

const validator = (o: { partido?: unknown; pe?: unknown; mp?: unknown; af?: unknown }) =>
  new ApuestaValidator(
    repo('af' in o ? o.af : { id: 1 }),
    repo('partido' in o ? o.partido : { id: 2, estado: 'PROGRAMADO' }),
    repo('mp' in o ? o.mp : { id: 3 }),
    repo('pe' in o ? o.pe : { equipoId: 10 }),
  );

describe('ApuestaValidator.validarCreacion', () => {
  it('acepta apuesta válida', async () => {
    await expect(validator({}).validarCreacion(dto)).resolves.toEqual({ id: 1 });
  });
  it('rechaza partido ya iniciado', async () => {
    const v = validator({ partido: { id: 2, estado: 'EN_CURSO' } });
    await expect(v.validarCreacion(dto)).rejects.toThrow('aún no han iniciado');
  });
  it('rechaza equipo que no juega el partido', async () => {
    await expect(validator({ pe: null }).validarCreacion(dto)).rejects.toThrow('no participa');
  });
  it('rechaza método de pago ajeno', async () => {
    await expect(validator({ mp: null }).validarCreacion(dto)).rejects.toThrow('método de pago');
  });
  it('rechaza aficionado y partido inexistentes', async () => {
    await expect(validator({ af: null }).validarCreacion(dto)).rejects.toThrow('Aficionado');
    await expect(validator({ partido: null }).validarCreacion(dto)).rejects.toThrow('Partido');
  });
});

describe('ApuestaValidator.validarCancelable', () => {
  const v = validator({});
  const apuesta = (estado: string, partido: string) =>
    ({ id: 1, estado, partido: { estado: partido } }) as unknown as Apuesta;

  it('permite cancelar apuesta registrada de partido programado', () => {
    expect(() => v.validarCancelable(apuesta('REGISTRADA', 'PROGRAMADO'))).not.toThrow();
  });
  it('bloquea si el partido ya inició', () => {
    expect(() => v.validarCancelable(apuesta('REGISTRADA', 'EN_CURSO'))).toThrow('ya inició');
  });
  it('bloquea apuesta ya liquidada o cancelada', () => {
    expect(() => v.validarCancelable(apuesta('GANADA', 'PROGRAMADO'))).toThrow('no puede cancelarse');
    expect(() => v.validarCancelable(apuesta('CANCELADA', 'PROGRAMADO'))).toThrow('no puede cancelarse');
  });
});

describe('ApuestasService', () => {
  const build = (cuota?: string) =>
    new ApuestasService(
      { find: jest.fn().mockResolvedValue([]) } as never,
      { buscarPartido: jest.fn().mockResolvedValue({}) } as never,
      new ApuestaMapper(),
      {} as never,
      {} as never,
      { get: () => cuota } as never,
    );

  it('cuota por defecto 1.85 y configurable por CUOTA_BASE', async () => {
    expect((await build().getCuota(1)).cuota).toBe(1.85);
    expect((await build('2.4').getCuota(1)).cuota).toBe(2.4);
    expect((await build('abc').getCuota(1)).cuota).toBe(1.85);
  });
  it('findByAficionado (mis-apuestas) consulta por aficionado', async () => {
    await expect(build().findByAficionado(7)).resolves.toEqual([]);
  });
});
