import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import {
  PageResponseDto,
  toPage,
} from '../../core/pagination/page-response.dto';
import { Deporte } from '../deportes/entities/deporte.entity';
import { Fase } from '../fases/entities/fase.entity';
import { FaseFinal } from '../fases-finales/entities/fase-final.entity';
import { GrupoEquipo } from '../grupos/entities/grupo-equipo.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { CambiarEstadoTorneoDto } from './dto/cambiar-estado-torneo.dto';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { TorneoQueryDto } from './dto/torneo-query.dto';
import {
  EstructuraFaseDto,
  EstructuraTorneoDto,
  TorneoResponseDto,
} from './dto/torneo-response.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { EstadoTorneo, Torneo } from './entities/torneo.entity';
import { TorneoMapper } from './mappers/torneo.mapper';

const TRANSICIONES: Record<EstadoTorneo, EstadoTorneo[]> = {
  INSCRIPCIONES_ABIERTAS: ['EN_CURSO', 'CANCELADO'],
  EN_CURSO: ['FINALIZADO', 'CANCELADO'],
  FINALIZADO: [],
  CANCELADO: [],
};

const dia = (f?: string | null): string | undefined =>
  f ? f.slice(0, 10) : undefined;

@Injectable()
export class TorneosService {
  constructor(
    @InjectRepository(Torneo)
    private readonly repo: Repository<Torneo>,
    @InjectRepository(Deporte)
    private readonly deporteRepo: Repository<Deporte>,
    @InjectRepository(Fase)
    private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Partido)
    private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,
    @InjectRepository(GrupoEquipo)
    private readonly grupoEquipoRepo: Repository<GrupoEquipo>,
    @InjectRepository(FaseFinal)
    private readonly faseFinalRepo: Repository<FaseFinal>,
    private readonly mapper: TorneoMapper,
  ) {}

  async create(dto: CreateTorneoDto): Promise<TorneoResponseDto> {
    this.validarFechas(
      dto.fechaInicio,
      dto.fechaFin,
      dto.fechaCierreInscripciones,
    );
    await this.validarDeporte(dto.deporteId);

    const saved = await this.repo.save(this.mapper.toEntity(dto));
    return this.findOne(saved.id);
  }

  async findAll(
    query: TorneoQueryDto,
  ): Promise<PageResponseDto<TorneoResponseDto>> {
    const where: FindOptionsWhere<Torneo> = {};
    if (query.nombre) where.nombre = Like(`%${query.nombre}%`);
    if (query.estado) where.estado = query.estado;
    if (query.deporteId !== undefined) where.deporteId = query.deporteId;
    if (query.activo !== undefined) where.activo = query.activo;

    const [list, total] = await this.repo.findAndCount({
      where,
      relations: { deporte: true },
      order: { fechaInicio: 'DESC', id: 'DESC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  async findOne(id: number): Promise<TorneoResponseDto> {
    return this.mapper.toResponseDto(await this.buscar(id));
  }

  async update(id: number, dto: UpdateTorneoDto): Promise<TorneoResponseDto> {
    const found = await this.buscar(id);
    if (found.estado === 'FINALIZADO' || found.estado === 'CANCELADO') {
      throw new ConflictException(
        `No se puede modificar un torneo ${found.estado}`,
      );
    }

    const inicio =
      dto.fechaInicio !== undefined
        ? dia(dto.fechaInicio)
        : dia(found.fechaInicio);
    const fin =
      dto.fechaFin !== undefined ? dia(dto.fechaFin) : dia(found.fechaFin);
    const cierre =
      dto.fechaCierreInscripciones !== undefined
        ? dia(dto.fechaCierreInscripciones)
        : dia(found.fechaCierreInscripciones);
    this.validarFechas(inicio, fin, cierre);

    if (
      dto.deporteId !== undefined &&
      Number(dto.deporteId) !== Number(found.deporteId)
    ) {
      await this.validarDeporte(dto.deporteId);
      const inscripciones = await this.inscripcionRepo.count({
        where: { torneoId: id },
      });
      if (inscripciones) {
        throw new ConflictException(
          `No se puede cambiar el deporte del torneo ${id}: tiene ${inscripciones} equipo(s) inscrito(s)`,
        );
      }
      found.deporteId = dto.deporteId;
    }

    if (dto.nombre !== undefined) found.nombre = dto.nombre.trim();
    found.fechaInicio = inicio;
    found.fechaFin = fin;
    found.fechaCierreInscripciones = cierre ?? null;
    found.deporte = undefined as never;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async cambiarEstado(
    id: number,
    dto: CambiarEstadoTorneoDto,
  ): Promise<TorneoResponseDto> {
    const found = await this.buscar(id);
    if (found.estado === dto.estado) return this.mapper.toResponseDto(found);
    if (!TRANSICIONES[found.estado].includes(dto.estado)) {
      throw new ConflictException(
        `Transición de estado no permitida: ${found.estado} → ${dto.estado}`,
      );
    }
    found.estado = dto.estado;
    found.deporte = undefined as never;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.buscar(id);
    const [fases, partidos, inscripciones] = await Promise.all([
      this.faseRepo.count({ where: { torneoId: id } }),
      this.partidoRepo.count({ where: { torneoId: id } }),
      this.inscripcionRepo.count({ where: { torneoId: id } }),
    ]);
    const motivos: string[] = [];
    if (fases) motivos.push(`${fases} fase(s)`);
    if (partidos) motivos.push(`${partidos} partido(s)`);
    if (inscripciones) motivos.push(`${inscripciones} inscripción(es)`);
    if (motivos.length) {
      throw new ConflictException(
        `No se puede eliminar el torneo ${id}: tiene ${motivos.join(', ')} asociado(s). Puede cancelarlo en su lugar.`,
      );
    }
    await this.repo.remove(found);
    return { message: `Torneo ${id} eliminado` };
  }

  /** Contrato para B: fases ordenadas, grupos con equipos y fase final. */
  async estructura(id: number): Promise<EstructuraTorneoDto> {
    const torneo = await this.buscar(id);
    const fases = await this.faseRepo.find({
      where: { torneoId: id },
      order: { orden: 'ASC', id: 'ASC' },
    });
    const faseIds = fases.map((f) => Number(f.id));

    const [grupos, finales] = faseIds.length
      ? await Promise.all([
          this.grupoRepo.find({
            where: { faseId: In(faseIds) },
            order: { id: 'ASC' },
          }),
          this.faseFinalRepo.find({ where: { faseId: In(faseIds) } }),
        ])
      : [[], []];
    const grupoIds = grupos.map((g) => Number(g.id));
    const miembros = grupoIds.length
      ? await this.grupoEquipoRepo.find({
          where: { grupoId: In(grupoIds) },
          relations: { equipo: true },
        })
      : [];

    const fasesDto: EstructuraFaseDto[] = fases.map((f) => {
      const dto: EstructuraFaseDto = {
        faseId: Number(f.id),
        nombre: f.nombre,
        tipo: f.tipo,
        orden: f.orden,
      };
      if (f.tipo === 'GRUPO') {
        dto.grupos = grupos
          .filter((g) => Number(g.faseId) === Number(f.id))
          .map((g) => ({
            grupoId: Number(g.id),
            nombreGrupo: g.nombreGrupo,
            equipos: miembros
              .filter((m) => Number(m.grupoId) === Number(g.id))
              .map((m) => ({
                equipoId: Number(m.equipoId),
                equipoNombre: m.equipo?.nombre,
              })),
          }));
      } else {
        dto.modalidad =
          finales.find((x) => Number(x.faseId) === Number(f.id))?.modalidad ??
          null;
      }
      return dto;
    });

    return {
      torneoId: Number(torneo.id),
      torneoNombre: torneo.nombre,
      estado: torneo.estado,
      fases: fasesDto,
    };
  }

  // --- reglas internas ---

  private async buscar(id: number): Promise<Torneo> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { deporte: true },
    });
    if (!found) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return found;
  }

  private async validarDeporte(deporteId: number): Promise<void> {
    const deporte = await this.deporteRepo.findOne({
      where: { id: deporteId },
    });
    if (!deporte) throw new NotFoundException(`Deporte ${deporteId} no existe`);
    if (!deporte.activo)
      throw new BadRequestException(`El deporte ${deporteId} está inactivo`);
  }

  private validarFechas(inicio?: string, fin?: string, cierre?: string): void {
    const i = dia(inicio);
    const f = dia(fin);
    const c = dia(cierre);
    if (i && f && f < i) {
      throw new BadRequestException(
        'fechaFin no puede ser anterior a fechaInicio',
      );
    }
    if (c && i && c > i) {
      throw new BadRequestException(
        'fechaCierreInscripciones no puede ser posterior a fechaInicio',
      );
    }
  }
}
