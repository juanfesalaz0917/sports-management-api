import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { PageResponseDto, toPage } from '../../core/pagination/page-response.dto';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { CambiarEstadoTorneoDto } from './dto/cambiar-estado-torneo.dto';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { TorneoQueryDto } from './dto/torneo-query.dto';
import { EstructuraTorneoDto, TorneoResponseDto } from './dto/torneo-response.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { EstadoTorneo, Torneo } from './entities/torneo.entity';
import { TorneoMapper } from './mappers/torneo.mapper';
import { TorneoEstructuraService } from './torneo-estructura.service';
import { TorneoValidator } from './validators/torneo.validator';

const TRANSICIONES: Record<EstadoTorneo, EstadoTorneo[]> = {
  INSCRIPCIONES_ABIERTAS: ['EN_CURSO', 'CANCELADO'],
  EN_CURSO: ['FINALIZADO', 'CANCELADO'],
  FINALIZADO: [],
  CANCELADO: [],
};

const dia = (f?: string | null): string | undefined => (f ? f.slice(0, 10) : undefined);

@Injectable()
export class TorneosService {
  constructor(
    @InjectRepository(Torneo)
    private readonly repo: Repository<Torneo>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    private readonly mapper: TorneoMapper,
    private readonly validator: TorneoValidator,
    private readonly estructuraService: TorneoEstructuraService,
  ) {}

  async create(dto: CreateTorneoDto): Promise<TorneoResponseDto> {
    this.validator.validarFechas(dto.fechaInicio, dto.fechaFin, dto.fechaCierreInscripciones);
    await this.validator.validarDeporte(dto.deporteId);
    const saved = await this.repo.save(this.mapper.toEntity(dto));
    return this.findOne(saved.id);
  }

  async findAll(query: TorneoQueryDto): Promise<PageResponseDto<TorneoResponseDto>> {
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
      throw new ConflictException(`No se puede modificar un torneo ${found.estado}`);
    }

    const inicio = dto.fechaInicio !== undefined ? dia(dto.fechaInicio) : dia(found.fechaInicio);
    const fin = dto.fechaFin !== undefined ? dia(dto.fechaFin) : dia(found.fechaFin);
    const cierre = dto.fechaCierreInscripciones !== undefined ? dia(dto.fechaCierreInscripciones) : dia(found.fechaCierreInscripciones);
    this.validator.validarFechas(inicio, fin, cierre);

    if (dto.deporteId !== undefined && Number(dto.deporteId) !== Number(found.deporteId)) {
      await this.validator.validarDeporte(dto.deporteId);
      const inscripciones = await this.inscripcionRepo.count({ where: { torneoId: id } });
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

  async cambiarEstado(id: number, dto: CambiarEstadoTorneoDto): Promise<TorneoResponseDto> {
    const found = await this.buscar(id);
    if (found.estado === dto.estado) return this.mapper.toResponseDto(found);
    if (!TRANSICIONES[found.estado].includes(dto.estado)) {
      throw new ConflictException(`Transición de estado no permitida: ${found.estado} → ${dto.estado}`);
    }
    found.estado = dto.estado;
    found.deporte = undefined as never;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.buscar(id);
    await this.validator.validarSinAsociaciones(id);
    await this.repo.remove(found);
    return { message: `Torneo ${id} eliminado` };
  }

  estructura(id: number): Promise<EstructuraTorneoDto> {
    return this.estructuraService.obtenerEstructura(id);
  }

  private async buscar(id: number): Promise<Torneo> {
    const found = await this.repo.findOne({ where: { id }, relations: { deporte: true } });
    if (!found) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return found;
  }
}
