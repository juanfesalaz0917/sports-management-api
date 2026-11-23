import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { PartidoResponseDto } from './dto/partido-response.dto';
import { UpdatePartidoEstadoDto } from './dto/update-partido-estado.dto';
import { Partido } from './entities/partido.entity';
import { PartidoEquipo } from './entities/partido-equipo.entity';
import { Apuesta } from '../apuestas/entities/apuesta.entity';
import { PartidoMapper } from './mappers/partido.mapper';
import { NotificationsGateway } from '../../gateways/notifications/notifications.gateway';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partido) private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(PartidoEquipo) private readonly peRepo: Repository<PartidoEquipo>,
    @InjectRepository(Apuesta) private readonly apuestaRepo: Repository<Apuesta>,
    private readonly mapper: PartidoMapper,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly notificacionesClient: NotificacionesClient,
  ) {}

  async create(dto: CreatePartidoDto): Promise<PartidoResponseDto> {
    if (dto.equipoLocalId === dto.equipoVisitanteId) {
      throw new BadRequestException('Un equipo no puede jugar contra sí mismo');
    }
    const entity = this.mapper.toEntity(dto);
    const saved = await this.partidoRepo.save(entity);

    await this.peRepo.save([
      { partidoId: saved.id, equipoId: dto.equipoLocalId, rol: 'LOCAL' },
      { partidoId: saved.id, equipoId: dto.equipoVisitanteId, rol: 'VISITANTE' },
    ]);

    const reloaded = await this.findOne(saved.id);
    this.notificationsGateway.broadcast('nuevo_partido', reloaded);
    this.notificacionesClient.enviarNotificacion({
      tipo: 'PARTIDO_CREADO',
      destinatarios: [process.env.NOTIFICATIONS_DEFAULT_RECIPIENT ?? 'aficionados@torneo.com'],
      asunto: 'Nuevo partido programado',
      mensaje: `Partido programado con ID ${saved.id}`,
    });

    return reloaded;
  }

  async findAll(torneoId?: number): Promise<PartidoResponseDto[]> {
    const where = torneoId ? { torneoId } : {};
    const list = await this.partidoRepo.find({
      where,
      relations: {
        torneo: true,
        fase: true,
        escenario: true,
        equipos: { equipo: true },
        pelota: true,
      },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async findOne(id: number): Promise<PartidoResponseDto> {
    const found = await this.partidoRepo.findOne({
      where: { id },
      relations: {
        torneo: true,
        fase: true,
        escenario: true,
        equipos: { equipo: true },
        pelota: true,
      },
    });
    if (!found) throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    return this.mapper.toResponseDto(found);
  }

  async updateEstado(id: number, dto: UpdatePartidoEstadoDto): Promise<PartidoResponseDto> {
    const partido = await this.partidoRepo.findOne({ where: { id } });
    if (!partido) throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    partido.estado = dto.estado;
    await this.partidoRepo.save(partido);
    return this.findOne(id);
  }

  async finalizarPartido(id: number, dto: { id_equipo_ganador?: number; es_empate?: boolean }) {
    const partido = await this.partidoRepo.findOne({ where: { id } });
    if (!partido) throw new NotFoundException(`Partido con ID ${id} no encontrado`);

    partido.estado = 'FINALIZADO';
    await this.partidoRepo.save(partido);

    // Liquidación automática de apuestas (HU-GC-07 y HU-GC-11)
    const pendientes = await this.apuestaRepo.find({ where: { partidoId: id, estado: 'PENDIENTE' } });
    for (const ap of pendientes) {
      if (dto.es_empate) {
        ap.estado = 'ANULADA';
      } else if (dto.id_equipo_ganador) {
        ap.estado = 'GANADA';
      } else {
        ap.estado = 'PERDIDA';
      }
      await this.apuestaRepo.save(ap);
    }

    this.notificationsGateway.broadcast('partido_finalizado', { id, resultado: dto });
    this.notificacionesClient.enviarNotificacion({
      tipo: 'RESULTADO_REGISTRADO',
      destinatarios: [process.env.NOTIFICATIONS_DEFAULT_RECIPIENT ?? 'aficionados@torneo.com'],
      asunto: `Resultado oficial del partido #${id}`,
      mensaje: `El partido ha finalizado y las apuestas asociadas han sido liquidadas.`,
    });

    return { success: true, message: `Partido ${id} finalizado y apuestas liquidadas.` };
  }
}
