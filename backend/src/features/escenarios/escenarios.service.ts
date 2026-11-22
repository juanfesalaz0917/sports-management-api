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
import { CambiarEstadoEscenarioDto } from './dto/cambiar-estado-escenario.dto';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { EscenarioQueryDto } from './dto/escenario-query.dto';
import { EscenarioResponseDto } from './dto/escenario-response.dto';
import { UpdateEscenarioDto } from './dto/update-escenario.dto';
import { Escenario } from './entities/escenario.entity';
import { EscenarioMapper } from './mappers/escenario.mapper';
import { EscenarioValidator } from './validators/escenario.validator';

@Injectable()
export class EscenariosService {
  constructor(
    @InjectRepository(Escenario)
    private readonly repo: Repository<Escenario>,
    private readonly mapper: EscenarioMapper,
    private readonly validator: EscenarioValidator,
  ) {}

  async create(dto: CreateEscenarioDto): Promise<EscenarioResponseDto> {
    if (dto.escenarioPadreId != null) {
      const padre = await this.repo.findOne({ where: { id: dto.escenarioPadreId } });
      if (!padre) throw new NotFoundException(`Escenario padre ${dto.escenarioPadreId} no existe`);
      if (!padre.activo) throw new BadRequestException('No se puede crear un espacio dentro de un escenario inactivo');
    }
    await this.validator.validarNombreUnico(dto.nombre, dto.escenarioPadreId ?? null);
    const saved = await this.repo.save(this.mapper.toEntity(dto));
    return this.findOne(saved.id);
  }

  createSubescenario(padreId: number, dto: CreateEscenarioDto): Promise<EscenarioResponseDto> {
    return this.create({ ...dto, escenarioPadreId: padreId });
  }

  async findAll(query: EscenarioQueryDto): Promise<PageResponseDto<EscenarioResponseDto>> {
    const where: FindOptionsWhere<Escenario> = {};
    if (query.nombre) where.nombre = Like(`%${query.nombre}%`);
    if (query.activo !== undefined) where.activo = query.activo;
    if (query.soloRaiz) where.escenarioPadreId = IsNull();

    const [list, total] = await this.repo.findAndCount({
      where,
      relations: { escenarioPadre: true },
      order: { nombre: 'ASC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  async findOne(id: number): Promise<EscenarioResponseDto> {
    return this.mapper.toResponseDto(await this.buscar(id));
  }

  async findSubescenarios(id: number): Promise<EscenarioResponseDto[]> {
    await this.buscar(id);
    const list = await this.repo.find({
      where: { escenarioPadreId: id },
      relations: { escenarioPadre: true },
      order: { nombre: 'ASC' },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async update(id: number, dto: UpdateEscenarioDto): Promise<EscenarioResponseDto> {
    const found = await this.buscar(id);
    const padreActual = found.escenarioPadreId == null ? null : Number(found.escenarioPadreId);
    const padreNuevo = dto.escenarioPadreId !== undefined ? (dto.escenarioPadreId ?? null) : padreActual;
    const nombreNuevo = dto.nombre?.trim() ?? found.nombre;

    if (dto.escenarioPadreId !== undefined && padreNuevo !== null) {
      await this.validator.validarPadre(id, padreNuevo);
    }
    if (nombreNuevo !== found.nombre || padreNuevo !== padreActual) {
      await this.validator.validarNombreUnico(nombreNuevo, padreNuevo, id);
    }

    found.nombre = nombreNuevo;
    if (dto.direccion !== undefined) found.direccion = dto.direccion.trim();
    found.escenarioPadreId = padreNuevo;
    found.escenarioPadre = undefined;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async cambiarEstado(id: number, dto: CambiarEstadoEscenarioDto): Promise<EscenarioResponseDto> {
    const found = await this.buscar(id);
    if (!dto.activo) {
      const hijosActivos = await this.repo.count({ where: { escenarioPadreId: id, activo: true } });
      if (hijosActivos) {
        throw new ConflictException(
          `No se puede desactivar el escenario ${id}: tiene ${hijosActivos} espacio(s) activo(s)`,
        );
      }
    } else if (found.escenarioPadre && !found.escenarioPadre.activo) {
      throw new ConflictException(
        `No se puede activar: el escenario padre "${found.escenarioPadre.nombre}" está inactivo`,
      );
    }
    found.activo = dto.activo;
    found.escenarioPadre = undefined;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.buscar(id);
    await this.validator.validarSinAsociaciones(id);
    await this.repo.remove(found);
    return { message: `Escenario ${id} eliminado` };
  }

  private async buscar(id: number): Promise<Escenario> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { escenarioPadre: true },
    });
    if (!found) throw new NotFoundException(`Escenario ${id} no encontrado`);
    return found;
  }
}
