import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApuestaDto } from './dto/create-apuesta.dto';
import { ApuestaResponseDto } from './dto/apuesta-response.dto';
import { Apuesta } from './entities/apuesta.entity';
import { ApuestaMapper } from './mappers/apuesta.mapper';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { MetodoPagoAficionado } from '../metodos-pago-aficionado/entities/metodo-pago-aficionado.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { NotificationsGateway } from '../../gateways/notifications/notifications.gateway';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';

@Injectable()
export class ApuestasService {
  constructor(
    @InjectRepository(Apuesta) private readonly repo: Repository<Apuesta>,
    @InjectRepository(Aficionado) private readonly aficionadoRepo: Repository<Aficionado>,
    @InjectRepository(Partido) private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(MetodoPagoAficionado) private readonly mpRepo: Repository<MetodoPagoAficionado>,
    private readonly mapper: ApuestaMapper,
    private readonly gateway: NotificationsGateway,
    private readonly notificacionesClient: NotificacionesClient,
  ) {}

  async create(dto: CreateApuestaDto): Promise<ApuestaResponseDto> {
    const aficionado = await this.aficionadoRepo.findOne({ where: { id: dto.aficionadoId } });
    if (!aficionado) throw new NotFoundException(`Aficionado ${dto.aficionadoId} no existe`);

    const partido = await this.partidoRepo.findOne({ where: { id: dto.partidoId } });
    if (!partido) throw new NotFoundException(`Partido ${dto.partidoId} no existe`);

    const mp = await this.mpRepo.findOne({ where: { id: dto.metodoAficionadoId, aficionadoId: dto.aficionadoId } });
    if (!mp) throw new BadRequestException('El método de pago no pertenece al aficionado');

    const entity = this.mapper.toEntity(dto);
    const saved = await this.repo.save(entity);

    this.gateway.broadcast('apuesta_registrada', { aficionadoId: dto.aficionadoId, apuestaId: saved.id });
    this.notificacionesClient.enviarNotificacion({
      tipo: 'APUESTA_REGISTRADA',
      destinatarios: ['aficionados@torneo.com'],
      asunto: 'Apuesta confirmada',
      mensaje: `Apuesta registrada por $${dto.monto}`,
    });

    return this.mapper.toResponseDto({ ...saved, aficionado });
  }

  async findByAficionado(aficionadoId: number): Promise<ApuestaResponseDto[]> {
    const list = await this.repo.find({ where: { aficionadoId }, relations: { aficionado: true } });
    return this.mapper.toResponseDtoList(list);
  }

  async findByPartido(partidoId: number): Promise<ApuestaResponseDto[]> {
    const list = await this.repo.find({ where: { partidoId }, relations: { aficionado: true } });
    return this.mapper.toResponseDtoList(list);
  }

  async cancelar(id: number): Promise<ApuestaResponseDto> {
    const apuesta = await this.repo.findOne({ where: { id }, relations: { partido: true } });
    if (!apuesta) throw new NotFoundException(`Apuesta ${id} no encontrada`);
    apuesta.estado = 'CANCELADA';
    const saved = await this.repo.save(apuesta);
    return this.mapper.toResponseDto(saved);
  }

  async liquidar(partidoId: number): Promise<{ totalLiquidadas: number }> {
    const apuestas = await this.repo.find({ where: { partidoId, estado: 'REGISTRADA' } });
    for (const a of apuestas) {
      a.estado = 'LIQUIDADA';
      await this.repo.save(a);
    }
    this.gateway.broadcast('apuestas_liquidadas', { partidoId, total: apuestas.length });
    return { totalLiquidadas: apuestas.length };
  }
}
