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
import { CambiarEstadoDeporteDto } from './dto/cambiar-estado-deporte.dto';
import { CreateDeporteDto } from './dto/create-deporte.dto';
import { DeporteQueryDto } from './dto/deporte-query.dto';
import { DeporteResponseDto } from './dto/deporte-response.dto';
import { UpdateDeporteDto } from './dto/update-deporte.dto';
import { Deporte } from './entities/deporte.entity';
import { DeporteMapper } from './mappers/deporte.mapper';
import { DeporteValidator } from './validators/deporte.validator';

@Injectable()
export class DeportesService {
  constructor(
    @InjectRepository(Deporte)
    private readonly repo: Repository<Deporte>,
    private readonly mapper: DeporteMapper,
    private readonly validator: DeporteValidator,
  ) {}

  async create(dto: CreateDeporteDto): Promise<DeporteResponseDto> {
    if (dto.deportePadreId != null) {
      const padre = await this.repo.findOne({ where: { id: dto.deportePadreId } });
      if (!padre) throw new NotFoundException(`Deporte padre ${dto.deportePadreId} no existe`);
      if (!padre.activo) {
        throw new BadRequestException('No se puede crear un subdeporte de un deporte inactivo');
      }
    }
    await this.validator.validarNombreUnico(dto.nombre, dto.deportePadreId ?? null);
    const saved = await this.repo.save(this.mapper.toEntity(dto));
    return this.findOne(saved.id);
  }

  async findAll(query: DeporteQueryDto): Promise<PageResponseDto<DeporteResponseDto>> {
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
    return this.mapper.toResponseDto(await this.buscar(id));
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
    const nuevoPadre = dto.deportePadreId !== undefined ? dto.deportePadreId : (found.deportePadreId ?? null);
    const nuevoNombre = dto.nombre?.trim() ?? found.nombre;

    if (dto.deportePadreId !== undefined && nuevoPadre !== null) {
      await this.validator.validarPadre(id, Number(nuevoPadre));
    }
    const padreActual = found.deportePadreId == null ? null : Number(found.deportePadreId);
    const padreNuevo = nuevoPadre == null ? null : Number(nuevoPadre);
    if (nuevoNombre !== found.nombre || padreNuevo !== padreActual) {
      await this.validator.validarNombreUnico(nuevoNombre, padreNuevo, id);
    }

    found.nombre = nuevoNombre;
    if (dto.descripcion !== undefined) found.descripcion = dto.descripcion;
    found.deportePadreId = padreNuevo;
    found.deportePadre = undefined;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async cambiarEstado(id: number, dto: CambiarEstadoDeporteDto): Promise<DeporteResponseDto> {
    const found = await this.buscar(id);
    if (!dto.activo) {
      await this.validator.validarSinAsociaciones(id, 'desactivar');
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
    await this.validator.validarSinAsociaciones(id, 'eliminar');
    await this.repo.remove(found);
    return { message: `Deporte ${id} eliminado` };
  }

  private async buscar(id: number): Promise<Deporte> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { deportePadre: true },
    });
    if (!found) throw new NotFoundException(`Deporte ${id} no encontrado`);
    return found;
  }
}
