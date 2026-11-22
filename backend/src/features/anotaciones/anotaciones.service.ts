import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnotacionDto } from './dto/create-anotacion.dto';
import { AnotacionResponseDto } from './dto/anotacion-response.dto';
import { Anotacion } from './entities/anotacion.entity';
import { AnotacionMapper } from './mappers/anotacion.mapper';
import { Partido } from '../partidos/entities/partido.entity';
import { Jugador } from '../stubs/entities/jugador.entity';
import { NotificationsGateway } from '../../gateways/notifications/notifications.gateway';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';

@Injectable()
export class AnotacionesService {
  constructor(
    @InjectRepository(Anotacion) private readonly repo: Repository<Anotacion>,
    @InjectRepository(Partido) private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(Jugador) private readonly jugadorRepo: Repository<Jugador>,
    private readonly mapper: AnotacionMapper,
    private readonly gateway: NotificationsGateway,
    private readonly notificacionesClient: NotificacionesClient,
  ) {}

  async create(partidoId: number, dto: CreateAnotacionDto): Promise<AnotacionResponseDto> {
    const partido = await this.partidoRepo.findOne({ where: { id: partidoId } });
    if (!partido) throw new NotFoundException(`Partido ${partidoId} no existe`);

    const jugador = await this.jugadorRepo.findOne({ where: { id: dto.jugadorId } });
    if (!jugador) throw new NotFoundException(`Jugador ${dto.jugadorId} no existe`);

    const entity = this.mapper.toEntity(partidoId, dto);
    const saved = await this.repo.save(entity);
    const reloaded = await this.repo.findOne({ where: { id: saved.id }, relations: { jugador: true } });

    this.gateway.broadcast('nueva_anotacion', reloaded);
    this.notificacionesClient.enviarNotificacion({
      tipo: 'ANOTACION_REGISTRADA',
      destinatarios: ['aficionados@torneo.com'],
      asunto: '¡Anotación registrada!',
      mensaje: `Anotación al minuto ${dto.minuto} en el partido ${partidoId}`,
    });

    return this.mapper.toResponseDto(reloaded!);
  }

  async findByPartido(partidoId: number): Promise<AnotacionResponseDto[]> {
    const list = await this.repo.find({
      where: { partidoId },
      relations: { jugador: true },
      order: { minuto: 'ASC' },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Anotación ${id} no encontrada`);
    await this.repo.remove(found);
    return { message: `Anotación ${id} eliminada` };
  }
}
