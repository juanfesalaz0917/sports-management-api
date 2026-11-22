import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from '../../core/pagination/page-query.dto';
import {
  PageResponseDto,
  toPage,
} from '../../core/pagination/page-response.dto';
import { hoyISO } from '../../core/utils/fecha.util';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { GrupoEquipo } from '../grupos/entities/grupo-equipo.entity';
import { PartidoEquipo } from '../partidos/entities/partido-equipo.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { InscripcionResponseDto } from './dto/inscripcion-response.dto';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionMapper } from './mappers/inscripcion.mapper';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly repo: Repository<Inscripcion>,
    @InjectRepository(Torneo)
    private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,
    @InjectRepository(EquipoDeporte)
    private readonly equipoDeporteRepo: Repository<EquipoDeporte>,
    @InjectRepository(GrupoEquipo)
    private readonly grupoEquipoRepo: Repository<GrupoEquipo>,
    @InjectRepository(PartidoEquipo)
    private readonly partidoEquipoRepo: Repository<PartidoEquipo>,
    private readonly mapper: InscripcionMapper,
  ) {}

  async inscribir(
    torneoId: number,
    equipoId: number,
  ): Promise<InscripcionResponseDto> {
    const torneo = await this.buscarTorneo(torneoId);
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo) throw new NotFoundException(`Equipo ${equipoId} no existe`);

    this.validarInscripcionesAbiertas(torneo, 'inscribir equipos');
    if (!equipo.activo)
      throw new BadRequestException(`El equipo ${equipoId} está inactivo`);

    const asociado = await this.equipoDeporteRepo.findOne({
      where: { equipoId, deporteId: torneo.deporteId },
    });
    if (!asociado) {
      throw new BadRequestException(
        `El equipo ${equipoId} no está asociado al deporte del torneo (deporte ${torneo.deporteId})`,
      );
    }

    const existente = await this.repo.findOne({
      where: { torneoId, equipoId },
    });
    if (existente) {
      throw new ConflictException(
        `El equipo ${equipoId} ya está inscrito en el torneo ${torneoId}`,
      );
    }

    const saved = await this.repo.save(
      this.repo.create({
        torneoId,
        equipoId,
        fechaInscripcion: hoyISO(),
        estado: 'INSCRITO',
      }),
    );
    return this.mapper.toResponseDto({ ...saved, torneo, equipo });
  }

  async retirar(
    torneoId: number,
    equipoId: number,
  ): Promise<{ message: string }> {
    const torneo = await this.buscarTorneo(torneoId);
    const inscripcion = await this.repo.findOne({
      where: { torneoId, equipoId },
    });
    if (!inscripcion) {
      throw new NotFoundException(
        `El equipo ${equipoId} no está inscrito en el torneo ${torneoId}`,
      );
    }
    this.validarInscripcionesAbiertas(torneo, 'retirar equipos');

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
    await this.repo.remove(inscripcion);
    return { message: `Equipo ${equipoId} retirado del torneo ${torneoId}` };
  }

  async findByTorneo(
    torneoId: number,
    query: PageQueryDto,
  ): Promise<PageResponseDto<InscripcionResponseDto>> {
    await this.buscarTorneo(torneoId);
    const [list, total] = await this.repo.findAndCount({
      where: { torneoId },
      relations: { torneo: true, equipo: true },
      order: { id: 'ASC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  /** Contrato para B: equipos inscritos y activos del torneo (habilitados para jugar). */
  async findEquiposHabilitados(
    torneoId: number,
  ): Promise<InscripcionResponseDto[]> {
    await this.buscarTorneo(torneoId);
    const list = await this.repo.find({
      where: { torneoId },
      relations: { torneo: true, equipo: true },
      order: { id: 'ASC' },
    });
    return this.mapper.toResponseDtoList(list.filter((i) => i.equipo?.activo));
  }

  async findByEquipo(equipoId: number): Promise<InscripcionResponseDto[]> {
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo)
      throw new NotFoundException(`Equipo ${equipoId} no encontrado`);
    const list = await this.repo.find({
      where: { equipoId },
      relations: { torneo: true, equipo: true },
      order: { id: 'DESC' },
    });
    return this.mapper.toResponseDtoList(list);
  }

  // --- reglas internas ---

  private async buscarTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneoRepo.findOne({ where: { id } });
    if (!torneo) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return torneo;
  }

  /** Inscribir o retirar solo es posible con inscripciones abiertas, antes del cierre y del inicio. */
  private validarInscripcionesAbiertas(torneo: Torneo, accion: string): void {
    const hoy = hoyISO();
    const cierre = torneo.fechaCierreInscripciones?.slice(0, 10);
    const inicio = torneo.fechaInicio?.slice(0, 10);
    if (!torneo.activo) {
      throw new ConflictException(
        `No se pueden ${accion}: el torneo ${torneo.id} está inactivo`,
      );
    }
    if (torneo.estado !== 'INSCRIPCIONES_ABIERTAS') {
      throw new ConflictException(
        `No se pueden ${accion}: el torneo está ${torneo.estado} y las inscripciones no están abiertas`,
      );
    }
    if (cierre && hoy > cierre) {
      throw new ConflictException(
        `No se pueden ${accion}: las inscripciones cerraron el ${cierre}`,
      );
    }
    if (inicio && hoy >= inicio) {
      throw new ConflictException(
        `No se pueden ${accion}: el torneo ya inició (${inicio})`,
      );
    }
  }
}
