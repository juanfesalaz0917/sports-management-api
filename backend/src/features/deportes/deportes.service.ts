import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Like, Repository } from 'typeorm';
import {
  PageResponseDto,
  toPage,
} from '../../core/pagination/page-response.dto';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { CambiarEstadoDeporteDto } from './dto/cambiar-estado-deporte.dto';
import { CreateDeporteDto } from './dto/create-deporte.dto';
import { DeporteQueryDto } from './dto/deporte-query.dto';
import { DeporteResponseDto } from './dto/deporte-response.dto';
import { UpdateDeporteDto } from './dto/update-deporte.dto';
import { Deporte } from './entities/deporte.entity';
import { DeporteMapper } from './mappers/deporte.mapper';

@Injectable()
export class DeportesService {
  constructor(
    @InjectRepository(Deporte)
    private readonly repo: Repository<Deporte>,
    @InjectRepository(EquipoDeporte)
    private readonly equipoDeporteRepo: Repository<EquipoDeporte>,
    @InjectRepository(Torneo)
    private readonly torneoRepo: Repository<Torneo>,
    private readonly mapper: DeporteMapper,
  ) {}

  async create(dto: CreateDeporteDto): Promise<DeporteResponseDto> {
    if (dto.deportePadreId != null) {
      const padre = await this.repo.findOne({
        where: { id: dto.deportePadreId },
      });
      if (!padre)
        throw new NotFoundException(
          `Deporte padre ${dto.deportePadreId} no existe`,
        );
      if (!padre.activo) {
        throw new BadRequestException(
          'No se puede crear un subdeporte de un deporte inactivo',
        );
      }
    }
    await this.validarNombreUnico(dto.nombre, dto.deportePadreId ?? null);

    const saved = await this.repo.save(this.mapper.toEntity(dto));
    return this.findOne(saved.id);
  }

  async findAll(
    query: DeporteQueryDto,
  ): Promise<PageResponseDto<DeporteResponseDto>> {
    const where: FindOptionsWhere<Deporte> = {};
    if (query.nombre) where.nombre = Like(`%${query.nombre}%`);
    if (query.activo !== undefined) where.activo = query.activo;
    if (query.soloRaiz) where.deportePadreId = IsNull();

    const [list, total] = await this.repo.findAndCount({
      where,
      relations: { deportePadre: true },
      order: { nombre: 'ASC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  async findOne(id: number): Promise<DeporteResponseDto> {
    const found = await this.buscar(id);
    return this.mapper.toResponseDto(found);
  }

  async findSubdeportes(id: number): Promise<DeporteResponseDto[]> {
    await this.buscar(id);
    const list = await this.repo.find({
      where: { deportePadreId: id },
      relations: { deportePadre: true },
      order: { nombre: 'ASC' },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async update(id: number, dto: UpdateDeporteDto): Promise<DeporteResponseDto> {
    const found = await this.buscar(id);

    const nuevoPadre =
      dto.deportePadreId !== undefined
        ? dto.deportePadreId
        : (found.deportePadreId ?? null);
    const nuevoNombre = dto.nombre?.trim() ?? found.nombre;

    if (dto.deportePadreId !== undefined && nuevoPadre !== null) {
      await this.validarPadre(id, Number(nuevoPadre));
    }
    const padreActual =
      found.deportePadreId == null ? null : Number(found.deportePadreId);
    const padreNuevo = nuevoPadre == null ? null : Number(nuevoPadre);
    if (nuevoNombre !== found.nombre || padreNuevo !== padreActual) {
      await this.validarNombreUnico(nuevoNombre, padreNuevo, id);
    }

    found.nombre = nuevoNombre;
    if (dto.descripcion !== undefined) found.descripcion = dto.descripcion;
    found.deportePadreId = padreNuevo;
    found.deportePadre = undefined;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async cambiarEstado(
    id: number,
    dto: CambiarEstadoDeporteDto,
  ): Promise<DeporteResponseDto> {
    const found = await this.buscar(id);
    if (!dto.activo) {
      await this.validarSinAsociaciones(id, 'desactivar');
    } else if (found.deportePadre && !found.deportePadre.activo) {
      throw new ConflictException(
        `No se puede activar: el deporte padre "${found.deportePadre.nombre}" está inactivo`,
      );
    }
    found.activo = dto.activo;
    found.deportePadre = undefined;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.buscar(id);
    await this.validarSinAsociaciones(id, 'eliminar');
    await this.repo.remove(found);
    return { message: `Deporte ${id} eliminado` };
  }

  // --- reglas internas ---

  private async buscar(id: number): Promise<Deporte> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { deportePadre: true },
    });
    if (!found) throw new NotFoundException(`Deporte ${id} no encontrado`);
    return found;
  }

  /** Nombre único dentro del mismo padre (los NULL no los cubre el UNIQUE de MySQL). */
  private async validarNombreUnico(
    nombre: string,
    padreId: number | null,
    excluirId?: number,
  ): Promise<void> {
    const existentes = await this.repo.find({
      where: {
        nombre: nombre.trim(),
        deportePadreId: padreId === null ? IsNull() : padreId,
      },
    });
    if (existentes.some((d) => Number(d.id) !== excluirId)) {
      throw new ConflictException(
        padreId === null
          ? `Ya existe un deporte "${nombre}"`
          : `Ya existe un subdeporte "${nombre}" dentro del deporte ${padreId}`,
      );
    }
  }

  /** El padre existe, no es el propio deporte ni uno de sus descendientes (sin ciclos). */
  private async validarPadre(id: number, padreId: number): Promise<void> {
    if (padreId === id) {
      throw new BadRequestException('Un deporte no puede ser su propio padre');
    }
    let actual: Deporte | null = await this.repo.findOne({
      where: { id: padreId },
    });
    if (!actual)
      throw new NotFoundException(`Deporte padre ${padreId} no existe`);
    const visitados = new Set<number>();
    while (
      actual &&
      actual.deportePadreId != null &&
      !visitados.has(Number(actual.id))
    ) {
      visitados.add(Number(actual.id));
      if (Number(actual.deportePadreId) === id) {
        throw new BadRequestException(
          'El deporte padre elegido es un subdeporte de este deporte (ciclo en la jerarquía)',
        );
      }
      actual = await this.repo.findOne({
        where: { id: Number(actual.deportePadreId) },
      });
    }
  }

  private async validarSinAsociaciones(
    id: number,
    accion: string,
  ): Promise<void> {
    const [subdeportes, equipos, torneos] = await Promise.all([
      this.repo.count({ where: { deportePadreId: id } }),
      this.equipoDeporteRepo.count({ where: { deporteId: id } }),
      this.torneoRepo.count({ where: { deporteId: id } }),
    ]);
    const motivos: string[] = [];
    if (subdeportes) motivos.push(`${subdeportes} subdeporte(s)`);
    if (equipos) motivos.push(`${equipos} equipo(s)`);
    if (torneos) motivos.push(`${torneos} torneo(s)`);
    if (motivos.length) {
      throw new ConflictException(
        `No se puede ${accion} el deporte ${id}: tiene ${motivos.join(', ')} asociado(s)`,
      );
    }
  }
}
