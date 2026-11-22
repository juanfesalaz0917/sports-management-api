import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hoyISO } from '../../core/utils/fecha.util';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { ActualizarVinculoDto } from './dto/actualizar-vinculo.dto';
import { AsociarJugadorDto } from './dto/asociar-jugador.dto';
import { EquipoJugadorResponseDto } from './dto/equipo-jugador-response.dto';
import { VinculoQueryDto } from './dto/vinculo-query.dto';
import { EquipoJugador } from './entities/equipo-jugador.entity';
import {
  EquipoJugadorMapper,
  esVigente,
} from './mappers/equipo-jugador.mapper';
import { EquipoJugadorValidator } from './validators/equipo-jugador.validator';

const dia = (f?: string | null): string | null => (f ? f.slice(0, 10) : null);

@Injectable()
export class EquiposJugadoresService {
  constructor(
    @InjectRepository(EquipoJugador)
    private readonly repo: Repository<EquipoJugador>,
    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,
    @InjectRepository(Jugador)
    private readonly jugadorRepo: Repository<Jugador>,
    private readonly mapper: EquipoJugadorMapper,
    private readonly validator: EquipoJugadorValidator,
  ) {}

  async asociar(equipoId: number, dto: AsociarJugadorDto): Promise<EquipoJugadorResponseDto> {
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo) throw new NotFoundException(`Equipo ${equipoId} no existe`);
    const jugador = await this.jugadorRepo.findOne({ where: { id: dto.jugadorId } });
    if (!jugador) throw new NotFoundException(`Jugador ${dto.jugadorId} no existe`);
    if (!equipo.activo) throw new BadRequestException(`El equipo ${equipoId} está inactivo`);
    if (!jugador.activo) throw new BadRequestException(`El jugador ${dto.jugadorId} está inactivo`);

    const inicio = dia(dto.fechaInicio) ?? hoyISO();
    const fin = dia(dto.fechaFin);
    this.validator.validarRango(inicio, fin);
    await this.validator.validarSinSolape(equipoId, dto.jugadorId, inicio, fin);

    const saved = await this.repo.save(
      this.repo.create({ equipoId, jugadorId: dto.jugadorId, fechaInicio: inicio, fechaFin: fin }),
    );
    return this.mapper.toResponseDto({ ...saved, equipo, jugador });
  }

  async actualizar(
    equipoId: number,
    jugadorId: number,
    dto: ActualizarVinculoDto,
  ): Promise<EquipoJugadorResponseDto> {
    const vinculo = await this.buscarVigente(equipoId, jugadorId);
    const inicio = dto.fechaInicio !== undefined ? dia(dto.fechaInicio) : dia(vinculo.fechaInicio);
    const fin = dto.fechaFin !== undefined ? dia(dto.fechaFin) : dia(vinculo.fechaFin);
    this.validator.validarRango(inicio, fin);
    await this.validator.validarSinSolape(equipoId, jugadorId, inicio, fin, vinculo.id);

    vinculo.fechaInicio = inicio;
    vinculo.fechaFin = fin;
    await this.repo.save(vinculo);
    return this.mapper.toResponseDto(vinculo);
  }

  async retirar(equipoId: number, jugadorId: number): Promise<EquipoJugadorResponseDto> {
    const vinculo = await this.buscarVigente(equipoId, jugadorId);
    const hoy = hoyISO();
    const inicio = dia(vinculo.fechaInicio);
    vinculo.fechaFin = inicio && inicio > hoy ? inicio : hoy;
    await this.repo.save(vinculo);
    return this.mapper.toResponseDto(vinculo);
  }

  async findJugadoresByEquipo(
    equipoId: number,
    query: VinculoQueryDto,
  ): Promise<EquipoJugadorResponseDto[]> {
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo) throw new NotFoundException(`Equipo ${equipoId} no encontrado`);
    return this.listar({ equipoId }, query);
  }

  async findEquiposByJugador(
    jugadorId: number,
    query: VinculoQueryDto,
  ): Promise<EquipoJugadorResponseDto[]> {
    const jugador = await this.jugadorRepo.findOne({ where: { id: jugadorId } });
    if (!jugador) throw new NotFoundException(`Jugador ${jugadorId} no encontrado`);
    return this.listar({ jugadorId }, query);
  }

  private async listar(
    where: { equipoId?: number; jugadorId?: number },
    query: VinculoQueryDto,
  ): Promise<EquipoJugadorResponseDto[]> {
    const list = await this.repo.find({
      where,
      relations: { equipo: true, jugador: true },
      order: { fechaInicio: 'DESC', id: 'DESC' },
    });
    const filtrada = query.vigentes === undefined ? list : list.filter((v) => esVigente(v) === query.vigentes);
    return this.mapper.toResponseDtoList(filtrada);
  }

  private async buscarVigente(equipoId: number, jugadorId: number): Promise<EquipoJugador> {
    const vinculos = await this.repo.find({
      where: { equipoId, jugadorId },
      relations: { equipo: true, jugador: true },
      order: { id: 'DESC' },
    });
    if (!vinculos.length) {
      throw new NotFoundException(`El jugador ${jugadorId} nunca ha estado en el equipo ${equipoId}`);
    }
    const vigente = vinculos.find((v) => esVigente(v));
    if (!vigente) {
      throw new NotFoundException(`El jugador ${jugadorId} no tiene un vínculo vigente con el equipo ${equipoId}`);
    }
    return vigente;
  }
}
