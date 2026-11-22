import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { EscenarioTorneo } from '../../escenarios-torneos/entities/escenario-torneo.entity';
import { Localidad } from '../../localidades/entities/localidad.entity';
import { Partido } from '../../partidos/entities/partido.entity';
import { Escenario } from '../entities/escenario.entity';

@Injectable()
export class EscenarioValidator {
  constructor(
    @InjectRepository(Escenario)
    private readonly repo: Repository<Escenario>,
    @InjectRepository(Localidad)
    private readonly localidadRepo: Repository<Localidad>,
    @InjectRepository(Partido)
    private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(EscenarioTorneo)
    private readonly escenarioTorneoRepo: Repository<EscenarioTorneo>,
  ) {}

  async validarNombreUnico(
    nombre: string,
    padreId: number | null,
    excluirId?: number,
  ): Promise<void> {
    const existentes = await this.repo.find({
      where: {
        nombre: nombre.trim(),
        escenarioPadreId: padreId === null ? IsNull() : padreId,
      },
    });
    if (existentes.some((e) => Number(e.id) !== excluirId)) {
      throw new ConflictException(
        padreId === null
          ? `Ya existe un escenario "${nombre}"`
          : `Ya existe un espacio "${nombre}" dentro del escenario ${padreId}`,
      );
    }
  }

  async validarPadre(id: number, padreId: number): Promise<void> {
    if (padreId === id) {
      throw new BadRequestException('Un escenario no puede ser su propio padre');
    }
    let actual: Escenario | null = await this.repo.findOne({ where: { id: padreId } });
    if (!actual) throw new NotFoundException(`Escenario padre ${padreId} no existe`);
    const visitados = new Set<number>();
    while (actual && actual.escenarioPadreId != null && !visitados.has(Number(actual.id))) {
      visitados.add(Number(actual.id));
      if (Number(actual.escenarioPadreId) === id) {
        throw new BadRequestException(
          'El escenario padre elegido está dentro de este escenario (ciclo en la jerarquía)',
        );
      }
      actual = await this.repo.findOne({ where: { id: Number(actual.escenarioPadreId) } });
    }
  }

  async validarSinAsociaciones(id: number): Promise<void> {
    const [hijos, localidades, partidos, torneos] = await Promise.all([
      this.repo.count({ where: { escenarioPadreId: id } }),
      this.localidadRepo.count({ where: { escenarioId: id } }),
      this.partidoRepo.count({ where: { escenarioId: id } }),
      this.escenarioTorneoRepo.count({ where: { escenarioId: id } }),
    ]);
    const motivos: string[] = [];
    if (hijos) motivos.push(`${hijos} espacio(s)`);
    if (localidades) motivos.push(`${localidades} localidad(es)`);
    if (partidos) motivos.push(`${partidos} partido(s)`);
    if (torneos) motivos.push(`${torneos} torneo(s)`);
    if (motivos.length) {
      throw new ConflictException(
        `No se puede eliminar el escenario ${id}: tiene ${motivos.join(', ')} asociado(s). Puede desactivarlo en su lugar.`,
      );
    }
  }
}
