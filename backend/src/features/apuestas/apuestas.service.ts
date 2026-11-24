import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from '../../core/pagination/page-query.dto';
import { PageResponseDto, toPage } from '../../core/pagination/page-response.dto';
import { CreateApuestaDto } from './dto/create-apuesta.dto';
import { ApuestaResponseDto } from './dto/apuesta-response.dto';
import { Apuesta } from './entities/apuesta.entity';
import { ApuestaMapper } from './mappers/apuesta.mapper';
import { ApuestaValidator } from './validators/apuesta.validator';
import { NotificationsGateway } from '../../gateways/notifications/notifications.gateway';
import { NotificacionesClient } from '../../core/notifications/notificaciones.client';

const CUOTA_POR_DEFECTO = 1.85;

@Injectable()
export class ApuestasService {
  constructor(
    @InjectRepository(Apuesta) private readonly repo: Repository<Apuesta>,
    private readonly validator: ApuestaValidator,
    private readonly mapper: ApuestaMapper,
    private readonly gateway: NotificationsGateway,
    private readonly notificacionesClient: NotificacionesClient,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateApuestaDto): Promise<ApuestaResponseDto> {
    const aficionado = await this.validator.validarCreacion(dto);
    const saved = await this.repo.save(this.mapper.toEntity(dto));

    this.gateway.broadcast('apuesta_registrada', { aficionadoId: dto.aficionadoId, apuestaId: saved.id });
    this.notificacionesClient.enviarNotificacion({
      tipo: 'APUESTA_REGISTRADA',
      destinatarios: [process.env.NOTIFICATIONS_DEFAULT_RECIPIENT ?? 'aficionados@torneo.com'],
      asunto: 'Apuesta confirmada',
      mensaje: `Apuesta registrada por $${dto.monto}`,
    });
    return this.mapper.toResponseDto({ ...saved, aficionado });
  }

  async findAll(
    aficionadoId?: number,
    partidoId?: number,
    query: PageQueryDto = new PageQueryDto(),
  ): Promise<PageResponseDto<ApuestaResponseDto>> {
    const where: { aficionadoId?: number; partidoId?: number } = {};
    if (aficionadoId) where.aficionadoId = aficionadoId;
    if (partidoId) where.partidoId = partidoId;
    const [list, total] = await this.repo.findAndCount({
      where,
      relations: { aficionado: true, partido: { equipos: { equipo: true } } },
      order: { fechaHora: 'DESC', id: 'DESC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  async findByAficionado(aficionadoId: number): Promise<ApuestaResponseDto[]> {
    const list = await this.repo.find({ where: { aficionadoId }, relations: { aficionado: true } });
    return this.mapper.toResponseDtoList(list);
  }

  async findByPartido(partidoId: number): Promise<ApuestaResponseDto[]> {
    const list = await this.repo.find({ where: { partidoId }, relations: { aficionado: true } });
    return this.mapper.toResponseDtoList(list);
  }

  async getCuota(partidoId: number): Promise<{ cuota: number }> {
    await this.validator.buscarPartido(partidoId);
    const configurada = Number(this.config.get<string>('CUOTA_BASE'));
    return { cuota: configurada > 1 ? configurada : CUOTA_POR_DEFECTO };
  }

  async cancelar(id: number): Promise<ApuestaResponseDto> {
    const apuesta = await this.repo.findOne({ where: { id }, relations: { partido: true } });
    if (!apuesta) throw new NotFoundException(`Apuesta ${id} no encontrada`);
    this.validator.validarCancelable(apuesta);
    apuesta.estado = 'CANCELADA';
    return this.mapper.toResponseDto(await this.repo.save(apuesta));
  }
}
