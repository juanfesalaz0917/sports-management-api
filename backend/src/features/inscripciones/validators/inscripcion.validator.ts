import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hoyISO } from '../../../core/utils/fecha.util';
import { GrupoEquipo } from '../../grupos/entities/grupo-equipo.entity';
import { PartidoEquipo } from '../../partidos/entities/partido-equipo.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

@Injectable()
export class InscripcionValidator {
  constructor(
    @InjectRepository(Torneo)
    private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(GrupoEquipo)
    private readonly grupoEquipoRepo: Repository<GrupoEquipo>,
    @InjectRepository(PartidoEquipo)
    private readonly partidoEquipoRepo: Repository<PartidoEquipo>,
  ) {}

  async buscarTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneoRepo.findOne({ where: { id } });
    if (!torneo) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return torneo;
  }

  validarInscripcionesAbiertas(torneo: Torneo, accion: string): void {
    const hoy = hoyISO();
    const cierre = torneo.fechaCierreInscripciones?.slice(0, 10);
    const inicio = torneo.fechaInicio?.slice(0, 10);
    if (!torneo.activo) {
      throw new ConflictException(`No se pueden ${accion}: el torneo ${torneo.id} está inactivo`);
    }
    if (torneo.estado !== 'INSCRIPCIONES_ABIERTAS') {
      throw new ConflictException(
        `No se pueden ${accion}: el torneo está ${torneo.estado} y las inscripciones no están abiertas`,
      );
    }
    if (cierre && hoy > cierre) {
      throw new ConflictException(`No se pueden ${accion}: las inscripciones cerraron el ${cierre}`);
    }
    if (inicio && hoy >= inicio) {
      throw new ConflictException(`No se pueden ${accion}: el torneo ya inició (${inicio})`);
    }
  }

  async validarRetiroSinAsociaciones(torneoId: number, equipoId: number): Promise<void> {
    const [grupos, partidos] = await Promise.all([
      this.grupoEquipoRepo
        .createQueryBuilder('ge')
        .innerJoin('ge.grupo', 'g')
        .innerJoin('g.fase', 'f')
        .where('ge.equipoId = :equipoId', { equipoId })
        .andWhere('f.torneoId = :torneoId', { torneoId })
        .getCount(),
      this.partidoEquipoRepo
        .createQueryBuilder('pe')
        .innerJoin('pe.partido', 'p')
        .where('pe.equipoId = :equipoId', { equipoId })
        .andWhere('p.torneoId = :torneoId', { torneoId })
        .getCount(),
    ]);
    const motivos: string[] = [];
    if (grupos) motivos.push(`${grupos} grupo(s)`);
    if (partidos) motivos.push(`${partidos} partido(s)`);
    if (motivos.length) {
      throw new ConflictException(
        `No se puede retirar el equipo ${equipoId} del torneo ${torneoId}: tiene ${motivos.join(', ')} asociado(s)`,
      );
    }
  }
}
