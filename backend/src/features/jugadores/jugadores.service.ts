import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { PageResponseDto, toPage } from '../../core/pagination/page-response.dto';
import { EquipoJugador } from '../equipos-jugadores/entities/equipo-jugador.entity';
import { esVigente } from '../equipos-jugadores/mappers/equipo-jugador.mapper';
import { HabilidadJugador } from '../habilidades-jugador/entities/habilidad-jugador.entity';
import { PosicionEspacial } from '../posiciones-espaciales/entities/posicion-espacial.entity';
import { CambiarEstadoJugadorDto } from './dto/cambiar-estado-jugador.dto';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { JugadorQueryDto } from './dto/jugador-query.dto';
import { JugadorPerfilDto, JugadorResponseDto } from './dto/jugador-response.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { Jugador } from './entities/jugador.entity';
import { JugadorMapper } from './mappers/jugador.mapper';
import { JugadorValidator } from './validators/jugador.validator';

@Injectable()
export class JugadoresService {
  constructor(
    @InjectRepository(Jugador) private readonly repo: Repository<Jugador>,
    @InjectRepository(PosicionEspacial) private readonly posicionRepo: Repository<PosicionEspacial>,
    @InjectRepository(EquipoJugador) private readonly equipoJugadorRepo: Repository<EquipoJugador>,
    @InjectRepository(HabilidadJugador) private readonly habilidadJugadorRepo: Repository<HabilidadJugador>,
    private readonly mapper: JugadorMapper,
    private readonly validator: JugadorValidator,
  ) {}

  async create(dto: CreateJugadorDto): Promise<JugadorResponseDto> {
    this.validator.validarFechaNacimiento(dto.fechaNacimiento);
    await this.validator.validarDocumentoUnico(dto.documento);
    if (dto.posicionId != null) await this.validator.validarPosicion(dto.posicionId);
    const saved = await this.repo.save(this.mapper.toEntity(dto));
    return this.findOne(saved.id);
  }

  async findAll(query: JugadorQueryDto): Promise<PageResponseDto<JugadorResponseDto>> {
    const where: FindOptionsWhere<Jugador> = {};
    if (query.nombre) where.nombre = Like(`%${query.nombre}%`);
    if (query.documento) where.documento = Like(`%${query.documento}%`);
    if (query.activo !== undefined) where.activo = query.activo;

    const [list, total] = await this.repo.findAndCount({
      where,
      order: { nombre: 'ASC', apellido: 'ASC' },
      skip: query.page * query.size,
      take: query.size,
    });
    const posiciones = await this.nombresPosicion(list);
    const content = list.map((j) => this.mapper.toResponseDto(j, posiciones.get(Number(j.posicionId))));
    return toPage(content, total, query);
  }

  async findOne(id: number): Promise<JugadorResponseDto> {
    const found = await this.buscar(id);
    const posiciones = await this.nombresPosicion([found]);
    return this.mapper.toResponseDto(found, posiciones.get(Number(found.posicionId)));
  }

  async perfil(id: number): Promise<JugadorPerfilDto> {
    const base = await this.findOne(id);
    const [vinculos, habilidades] = await Promise.all([
      this.equipoJugadorRepo.find({ where: { jugadorId: id }, relations: { equipo: true }, order: { fechaInicio: 'DESC', id: 'DESC' } }),
      this.habilidadJugadorRepo.find({ where: { jugadorId: id }, relations: { habilidad: true } }),
    ]);

    const equipos = vinculos.map((v) => ({
      vinculoId: Number(v.id),
      equipoId: Number(v.equipoId),
      equipoNombre: v.equipo?.nombre,
      fechaInicio: v.fechaInicio ?? null,
      fechaFin: v.fechaFin ?? null,
      vigente: esVigente(v),
    }));

    return {
      ...base,
      equipos,
      habilidades: habilidades.map((h) => ({ habilidadId: Number(h.habilidadId), nombre: h.habilidad?.nombre, descripcion: h.habilidad?.descripcion ?? undefined })),
      mensajeEquipos: equipos.length ? undefined : 'El jugador no tiene equipos asociados',
      mensajeHabilidades: habilidades.length ? undefined : 'El jugador no tiene habilidades registradas',
    };
  }

  async update(id: number, dto: UpdateJugadorDto): Promise<JugadorResponseDto> {
    const found = await this.buscar(id);
    if (dto.fechaNacimiento !== undefined) this.validator.validarFechaNacimiento(dto.fechaNacimiento);
    if (dto.documento !== undefined && dto.documento.trim() !== found.documento) {
      await this.validator.validarDocumentoUnico(dto.documento, id);
    }
    if (dto.posicionId != null) await this.validator.validarPosicion(dto.posicionId);

    if (dto.nombre !== undefined) found.nombre = dto.nombre.trim();
    if (dto.apellido !== undefined) found.apellido = dto.apellido.trim();
    if (dto.documento !== undefined) found.documento = dto.documento.trim();
    if (dto.fechaNacimiento !== undefined) found.fechaNacimiento = dto.fechaNacimiento;
    if (dto.posicionId !== undefined) found.posicionId = dto.posicionId;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async cambiarEstado(id: number, dto: CambiarEstadoJugadorDto): Promise<JugadorResponseDto> {
    const found = await this.buscar(id);
    found.activo = dto.activo;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.buscar(id);
    await this.validator.validarSinAsociaciones(id);
    await this.repo.remove(found);
    return { message: `Jugador ${id} eliminado` };
  }

  private async buscar(id: number): Promise<Jugador> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Jugador ${id} no encontrado`);
    return found;
  }

  private async nombresPosicion(jugadores: Jugador[]): Promise<Map<number, string>> {
    const ids = [...new Set(jugadores.filter((j) => j.posicionId != null).map((j) => Number(j.posicionId)))];
    const mapa = new Map<number, string>();
    if (!ids.length) return mapa;
    const posiciones = await this.posicionRepo.findBy({ id: In(ids) });
    posiciones.forEach((p) => mapa.set(Number(p.id), p.nombre));
    return mapa;
  }
}
