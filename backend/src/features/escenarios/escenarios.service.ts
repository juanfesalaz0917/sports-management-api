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
import { EscenarioTorneo } from '../escenarios-torneos/entities/escenario-torneo.entity';
import { Localidad } from '../localidades/entities/localidad.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { CambiarEstadoEscenarioDto } from './dto/cambiar-estado-escenario.dto';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { EscenarioQueryDto } from './dto/escenario-query.dto';
import { EscenarioResponseDto } from './dto/escenario-response.dto';
import { UpdateEscenarioDto } from './dto/update-escenario.dto';
import { Escenario } from './entities/escenario.entity';
import { EscenarioMapper } from './mappers/escenario.mapper';

@Injectable()
export class EscenariosService {
  constructor(
    @InjectRepository(Escenario)
    private readonly repo: Repository<Escenario>,
    @InjectRepository(Localidad)
    private readonly localidadRepo: Repository<Localidad>,
    @InjectRepository(Partido)
    private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(EscenarioTorneo)
    private readonly escenarioTorneoRepo: Repository<EscenarioTorneo>,
    private readonly mapper: EscenarioMapper,
  ) {}

  async create(dto: CreateEscenarioDto): Promise<EscenarioResponseDto> {
    if (dto.escenarioPadreId != null) {
      const padre = await this.repo.findOne({
        where: { id: dto.escenarioPadreId },
      });
      if (!padre)
        throw new NotFoundException(
          `Escenario padre ${dto.escenarioPadreId} no existe`,
        );
      if (!padre.activo) {
        throw new BadRequestException(
          'No se puede crear un espacio dentro de un escenario inactivo',
        );
      }
    }
    await this.validarNombreUnico(dto.nombre, dto.escenarioPadreId ?? null);

    const saved = await this.repo.save(this.mapper.toEntity(dto));
    return this.findOne(saved.id);
  }

  /** Crea un escenario hijo (espacio) dentro del escenario indicado en la ruta. */
  createSubescenario(
    padreId: number,
    dto: CreateEscenarioDto,
  ): Promise<EscenarioResponseDto> {
    return this.create({ ...dto, escenarioPadreId: padreId });
  }

  async findAll(
    query: EscenarioQueryDto,
  ): Promise<PageResponseDto<EscenarioResponseDto>> {
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

  async update(
    id: number,
    dto: UpdateEscenarioDto,
  ): Promise<EscenarioResponseDto> {
    const found = await this.buscar(id);

    const padreActual =
      found.escenarioPadreId == null ? null : Number(found.escenarioPadreId);
    const padreNuevo =
      dto.escenarioPadreId !== undefined
        ? (dto.escenarioPadreId ?? null)
        : padreActual;
    const nombreNuevo = dto.nombre?.trim() ?? found.nombre;

    if (dto.escenarioPadreId !== undefined && padreNuevo !== null) {
      await this.validarPadre(id, padreNuevo);
    }
    if (nombreNuevo !== found.nombre || padreNuevo !== padreActual) {
      await this.validarNombreUnico(nombreNuevo, padreNuevo, id);
    }

    found.nombre = nombreNuevo;
    if (dto.direccion !== undefined) found.direccion = dto.direccion.trim();
    found.escenarioPadreId = padreNuevo;
    found.escenarioPadre = undefined;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async cambiarEstado(
    id: number,
    dto: CambiarEstadoEscenarioDto,
  ): Promise<EscenarioResponseDto> {
    const found = await this.buscar(id);
    if (!dto.activo) {
      const hijosActivos = await this.repo.count({
        where: { escenarioPadreId: id, activo: true },
      });
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
    await this.repo.remove(found);
    return { message: `Escenario ${id} eliminado` };
  }

  // --- reglas internas ---

  private async buscar(id: number): Promise<Escenario> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { escenarioPadre: true },
    });
    if (!found) throw new NotFoundException(`Escenario ${id} no encontrado`);
    return found;
  }

  private async validarNombreUnico(
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

  /** El padre existe, no es el propio escenario ni uno de sus descendientes (sin ciclos). */
  private async validarPadre(id: number, padreId: number): Promise<void> {
    if (padreId === id) {
      throw new BadRequestException(
        'Un escenario no puede ser su propio padre',
      );
    }
    let actual: Escenario | null = await this.repo.findOne({
      where: { id: padreId },
    });
    if (!actual)
      throw new NotFoundException(`Escenario padre ${padreId} no existe`);
    const visitados = new Set<number>();
    while (
      actual &&
      actual.escenarioPadreId != null &&
      !visitados.has(Number(actual.id))
    ) {
      visitados.add(Number(actual.id));
      if (Number(actual.escenarioPadreId) === id) {
        throw new BadRequestException(
          'El escenario padre elegido está dentro de este escenario (ciclo en la jerarquía)',
        );
      }
      actual = await this.repo.findOne({
        where: { id: Number(actual.escenarioPadreId) },
      });
    }
  }
}
