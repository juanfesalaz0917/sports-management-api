import {
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
import { EquipoJugador } from '../equipos-jugadores/entities/equipo-jugador.entity';
import { GrupoEquipo } from '../grupos/entities/grupo-equipo.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { PartidoEquipo } from '../partidos/entities/partido-equipo.entity';
import { CambiarEstadoEquipoDto } from './dto/cambiar-estado-equipo.dto';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { EquipoQueryDto } from './dto/equipo-query.dto';
import { EquipoResponseDto } from './dto/equipo-response.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Equipo } from './entities/equipo.entity';
import { EquipoMapper } from './mappers/equipo.mapper';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly repo: Repository<Equipo>,
    @InjectRepository(EquipoDeporte)
    private readonly equipoDeporteRepo: Repository<EquipoDeporte>,
    @InjectRepository(EquipoJugador)
    private readonly equipoJugadorRepo: Repository<EquipoJugador>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(GrupoEquipo)
    private readonly grupoEquipoRepo: Repository<GrupoEquipo>,
    @InjectRepository(PartidoEquipo)
    private readonly partidoEquipoRepo: Repository<PartidoEquipo>,
    private readonly mapper: EquipoMapper,
  ) {}

  async create(dto: CreateEquipoDto): Promise<EquipoResponseDto> {
    await this.validarNombreUnico(dto.nombre, dto.genero ?? null);
    const saved = await this.repo.save(this.mapper.toEntity(dto));
    return this.mapper.toResponseDto(saved);
  }

  async findAll(
    query: EquipoQueryDto,
  ): Promise<PageResponseDto<EquipoResponseDto>> {
    const where: FindOptionsWhere<Equipo> = {};
    if (query.nombre) where.nombre = Like(`%${query.nombre}%`);
    if (query.genero) where.genero = query.genero;
    if (query.activo !== undefined) where.activo = query.activo;

    const [list, total] = await this.repo.findAndCount({
      where,
      order: { nombre: 'ASC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  async findOne(id: number): Promise<EquipoResponseDto> {
    return this.mapper.toResponseDto(await this.buscar(id));
  }

  async update(id: number, dto: UpdateEquipoDto): Promise<EquipoResponseDto> {
    const found = await this.buscar(id);
    const nombre = dto.nombre?.trim() ?? found.nombre;
    const genero =
      dto.genero !== undefined ? dto.genero : (found.genero ?? null);

    if (nombre !== found.nombre || genero !== (found.genero ?? null)) {
      await this.validarNombreUnico(nombre, genero, id);
    }
    found.nombre = nombre;
    found.genero = genero;
    if (dto.fechaCreacion !== undefined)
      found.fechaCreacion = dto.fechaCreacion;
    return this.mapper.toResponseDto(await this.repo.save(found));
  }

  async cambiarEstado(
    id: number,
    dto: CambiarEstadoEquipoDto,
  ): Promise<EquipoResponseDto> {
    const found = await this.buscar(id);
    found.activo = dto.activo;
    return this.mapper.toResponseDto(await this.repo.save(found));
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.buscar(id);
    const [jugadores, deportes, inscripciones, grupos, partidos] =
      await Promise.all([
        this.equipoJugadorRepo.count({ where: { equipoId: id } }),
        this.equipoDeporteRepo.count({ where: { equipoId: id } }),
        this.inscripcionRepo.count({ where: { equipoId: id } }),
        this.grupoEquipoRepo.count({ where: { equipoId: id } }),
        this.partidoEquipoRepo.count({ where: { equipoId: id } }),
      ]);
    const motivos: string[] = [];
    if (jugadores) motivos.push(`${jugadores} vínculo(s) con jugadores`);
    if (deportes) motivos.push(`${deportes} deporte(s)`);
    if (inscripciones) motivos.push(`${inscripciones} inscripción(es)`);
    if (grupos) motivos.push(`${grupos} grupo(s)`);
    if (partidos) motivos.push(`${partidos} partido(s)`);
    if (motivos.length) {
      throw new ConflictException(
        `No se puede eliminar el equipo ${id}: tiene ${motivos.join(', ')} asociado(s). Puede desactivarlo en su lugar.`,
      );
    }
    await this.repo.remove(found);
    return { message: `Equipo ${id} eliminado` };
  }

  private async buscar(id: number): Promise<Equipo> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Equipo ${id} no encontrado`);
    return found;
  }

  /** Un mismo club puede tener equipos homónimos en distinta modalidad (masculino/femenino). */
  private async validarNombreUnico(
    nombre: string,
    genero: string | null,
    excluirId?: number,
  ): Promise<void> {
    const existentes = await this.repo.find({
      where: {
        nombre: nombre.trim(),
        genero:
          genero === null
            ? IsNull()
            : (genero as NonNullable<Equipo['genero']>),
      },
    });
    if (existentes.some((e) => Number(e.id) !== excluirId)) {
      throw new ConflictException(
        `Ya existe un equipo "${nombre}"${genero ? ` en modalidad ${genero}` : ''}`,
      );
    }
  }
}
