import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { NotificationsGateway } from '../../gateways/notifications/notifications.gateway';
import { PosicionElementoDto } from './dto/registrar-posiciones-lote.dto';
import { Partido } from './entities/partido.entity';
import { PartidoEquipo } from './entities/partido-equipo.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { EquipoJugador } from '../equipos-jugadores/entities/equipo-jugador.entity';
import { PosicionEspacial } from '../posiciones-espaciales/entities/posicion-espacial.entity';

export interface PosicionRegistro {
  partidoId: number;
  jugadorId?: number;
  pelotaId?: number;
  esPelota: boolean;
  x: number;
  y: number;
  timestamp: string;
}

const MAX_REGISTROS_POR_PARTIDO = 500;

@Injectable()
export class PartidoPosicionesService {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    @InjectRepository(Partido) private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(PartidoEquipo) private readonly partidoEquipoRepo: Repository<PartidoEquipo>,
    @InjectRepository(Jugador) private readonly jugadorRepo: Repository<Jugador>,
    @InjectRepository(EquipoJugador) private readonly equipoJugadorRepo: Repository<EquipoJugador>,
    @InjectRepository(PosicionEspacial) private readonly posicionRepo: Repository<PosicionEspacial>,
  ) {}

  async registrarLote(partidoId: number, dto: { posiciones?: PosicionElementoDto[] } | PosicionElementoDto[]): Promise<PosicionRegistro[]> {
    const partido = await this.partidoRepo.findOne({ where: { id: partidoId }, relations: { pelota: true } });
    if (!partido) throw new NotFoundException(`Partido ${partidoId} no encontrado`);
    if (partido.estado === 'FINALIZADO' || partido.estado === 'CANCELADO') {
      throw new ConflictException(`El partido ${partidoId} ya está ${partido.estado}`);
    }

    const lista = Array.isArray(dto) ? dto : dto?.posiciones;
    if (!Array.isArray(lista) || lista.length === 0) throw new BadRequestException('Se requiere al menos una posición');

    const participantes = await this.partidoEquipoRepo.find({ where: { partidoId } });
    const equipoIds = participantes.map((p) => p.equipoId);
    if (!equipoIds.length) throw new BadRequestException('El partido no tiene equipos registrados');

    const vinculos = await this.equipoJugadorRepo.find({
      where: equipoIds.map((equipoId) => ({ equipoId })),
      relations: { jugador: true },
    });
    const vigentes = new Set(vinculos.filter((v) => !v.fechaFin).map((v) => Number(v.jugadorId)));

    const ahora = new Date();
    const entidades = [] as PosicionEspacial[];
    for (const posicion of lista) {
      if (!Number.isFinite(posicion.x) || !Number.isFinite(posicion.y) || posicion.x < 0 || posicion.x > 1 || posicion.y < 0 || posicion.y > 1) {
        throw new BadRequestException('x y y deben ser números finitos entre 0 y 1');
      }
      const timestamp = posicion.timestamp ? new Date(posicion.timestamp) : ahora;
      if (Number.isNaN(timestamp.getTime())) throw new BadRequestException('timestamp inválido');

      if (posicion.esPelota) {
        if (!posicion.jugadorId && !partido.pelotaId) throw new BadRequestException('El partido no tiene una pelota asociada');
        if (posicion.jugadorId) throw new BadRequestException('Una posición de pelota no puede incluir jugadorId');
        entidades.push(this.posicionRepo.create({
          partidoId,
          pelotaId: partido.pelotaId,
          esPelota: true,
          jugadorId: null,
          x: Number(posicion.x.toFixed(4)),
          y: Number(posicion.y.toFixed(4)),
          timestamp,
        }));
      } else {
        if (!posicion.jugadorId) throw new BadRequestException('Se requiere jugadorId para una posición de jugador');
        const jugador = await this.jugadorRepo.findOne({ where: { id: posicion.jugadorId } });
        if (!jugador || !jugador.activo) throw new NotFoundException(`Jugador ${posicion.jugadorId} no encontrado o inactivo`);
        if (!vigentes.has(Number(posicion.jugadorId))) throw new ConflictException(`El jugador ${posicion.jugadorId} no pertenece a un equipo vigente del partido`);
        entidades.push(this.posicionRepo.create({
          partidoId,
          jugadorId: posicion.jugadorId,
          pelotaId: null,
          esPelota: false,
          x: Number(posicion.x.toFixed(4)),
          y: Number(posicion.y.toFixed(4)),
          timestamp,
        }));
      }
    }

    const guardadas = await this.posicionRepo.save(entidades);
    const count = await this.posicionRepo.count({ where: { partidoId } });
    if (count > MAX_REGISTROS_POR_PARTIDO) {
      const antiguas = await this.posicionRepo.find({ where: { partidoId }, order: { timestamp: 'ASC', id: 'ASC' }, take: count - MAX_REGISTROS_POR_PARTIDO });
      await this.posicionRepo.remove(antiguas);
    }

    const nuevos = guardadas.map((p) => this.aRegistro(p));
    this.notificationsGateway.broadcast(`partido_${partidoId}_posiciones`, nuevos);
    return nuevos;
  }

  async obtenerUltimas(partidoId: number): Promise<PosicionRegistro[]> {
    await this.verificarPartido(partidoId);
    const todos = await this.posicionRepo.find({ where: { partidoId }, order: { timestamp: 'DESC', id: 'DESC' } });
    const mapa = new Map<string, PosicionEspacial>();
    for (const reg of todos) {
      const clave = reg.esPelota ? 'pelota' : `jugador_${reg.jugadorId}`;
      if (!mapa.has(clave)) mapa.set(clave, reg);
    }
    return Array.from(mapa.values()).map((p) => this.aRegistro(p));
  }

  async obtenerHistorial(partidoId: number, desde?: string): Promise<PosicionRegistro[]> {
    await this.verificarPartido(partidoId);
    let fechaDesde: Date | undefined;
    if (desde) {
      fechaDesde = new Date(desde);
      if (Number.isNaN(fechaDesde.getTime())) throw new BadRequestException('desde debe ser un timestamp válido');
    }
    const todos = await this.posicionRepo.find({
      where: fechaDesde ? { partidoId, timestamp: MoreThanOrEqual(fechaDesde) } : { partidoId },
      order: { timestamp: 'ASC', id: 'ASC' },
    });
    return todos.map((p) => this.aRegistro(p));
  }

  private async verificarPartido(partidoId: number): Promise<void> {
    const partido = await this.partidoRepo.findOne({ where: { id: partidoId } });
    if (!partido) throw new NotFoundException(`Partido ${partidoId} no encontrado`);
  }

  private aRegistro(p: PosicionEspacial): PosicionRegistro {
    return {
      partidoId: Number(p.partidoId),
      jugadorId: p.jugadorId ? Number(p.jugadorId) : undefined,
      pelotaId: p.pelotaId ? Number(p.pelotaId) : undefined,
      esPelota: Boolean(p.esPelota),
      x: Number(p.x),
      y: Number(p.y),
      timestamp: p.timestamp instanceof Date ? p.timestamp.toISOString() : new Date(p.timestamp).toISOString(),
    };
  }
}
