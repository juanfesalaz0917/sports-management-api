import { BadRequestException, ConflictException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PageQueryDto } from '../../core/pagination/page-query.dto';
import { PageResponseDto, toPage } from '../../core/pagination/page-response.dto';
import { liquidarApuestas, ESTADOS_LIQUIDABLES } from '../apuestas/liquidacion/liquidacion.util';
import { PartidoValidator } from './validators/partido.validator';
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
    @Optional() private readonly validator?: PartidoValidator,
  ) {}

  async create(dto: CreatePartidoDto): Promise<PartidoResponseDto> {
    if (dto.equipoLocalId === dto.equipoVisitanteId) {
      throw new BadRequestException('Un equipo no puede jugar contra sí mismo');
    }
    if (this.validator) await this.validator.validarReferencias(dto);
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

  async findAll(torneoId?: number, query: PageQueryDto = new PageQueryDto()): Promise<PageResponseDto<PartidoResponseDto>> {
    const where = torneoId ? { torneoId } : {};
    const [list, total] = await this.partidoRepo.findAndCount({
      where,
      relations: { torneo: true, fase: true, escenario: true, equipos: { equipo: true }, pelota: true },
      order: { fechaHora: 'DESC', id: 'DESC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  async findDisponiblesApuesta(): Promise<PartidoResponseDto[]> {
    const list = await this.partidoRepo.find({
      where: { estado: 'PROGRAMADO' },
      relations: { torneo: true, fase: true, escenario: true, equipos: { equipo: true }, pelota: true },
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

  async findByFase(faseId: number): Promise<PartidoResponseDto[]> {
    const list = await this.partidoRepo.find({
      where: { faseId },
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
    if (partido.estado === 'FINALIZADO' || partido.estado === 'CANCELADO') {
      throw new ConflictException(`El partido ${id} ya está ${partido.estado}`);
    }
    if (!dto.es_empate && dto.id_equipo_ganador) {
      const participa = await this.peRepo.findOne({ where: { partidoId: id, equipoId: dto.id_equipo_ganador } });
      if (!participa) throw new BadRequestException('El equipo ganador no participa en el partido');
    }

    partido.estado = 'FINALIZADO';
    await this.partidoRepo.save(partido);

    // Liquidación (HU-GC-07 y HU-GC-11): gana solo quien apostó por el equipo ganador
    const pendientes = await this.apuestaRepo.find({
      where: { partidoId: id, estado: In(ESTADOS_LIQUIDABLES) },
    });
    const resultado = { ganadorId: dto.id_equipo_ganador, esEmpate: dto.es_empate };
    await this.apuestaRepo.save(liquidarApuestas(pendientes, resultado));

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
