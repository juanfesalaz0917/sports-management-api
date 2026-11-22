import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escenario } from '../escenarios/entities/escenario.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { EscenarioTorneoResponseDto } from './dto/escenario-torneo-response.dto';
import { EscenarioTorneo } from './entities/escenario-torneo.entity';
import { EscenarioTorneoMapper } from './mappers/escenario-torneo.mapper';

@Injectable()
export class EscenariosTorneosService {
  constructor(
    @InjectRepository(EscenarioTorneo)
    private readonly repo: Repository<EscenarioTorneo>,
    @InjectRepository(Escenario)
    private readonly escenarioRepo: Repository<Escenario>,
    @InjectRepository(Torneo)
    private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(Partido)
    private readonly partidoRepo: Repository<Partido>,
    private readonly mapper: EscenarioTorneoMapper,
  ) {}

  async asignar(
    torneoId: number,
    escenarioId: number,
  ): Promise<EscenarioTorneoResponseDto> {
    const torneo = await this.buscarTorneo(torneoId);
    const escenario = await this.escenarioRepo.findOne({
      where: { id: escenarioId },
    });
    if (!escenario)
      throw new NotFoundException(`Escenario ${escenarioId} no existe`);
    if (torneo.estado === 'FINALIZADO' || torneo.estado === 'CANCELADO') {
      throw new ConflictException(
        `No se pueden asignar escenarios a un torneo ${torneo.estado}`,
      );
    }
    if (!escenario.activo) {
      throw new BadRequestException(
        `El escenario ${escenarioId} está inactivo`,
      );
    }

    const existente = await this.repo.findOne({
      where: { torneoId, escenarioId },
    });
    if (existente) {
      throw new ConflictException(
        `El escenario ${escenarioId} ya está asignado al torneo ${torneoId}`,
      );
    }
    await this.repo.save(this.repo.create({ torneoId, escenarioId }));
    return this.mapper.toResponseDto({
      torneoId,
      escenarioId,
      torneo,
      escenario,
    });
  }

  async quitar(
    torneoId: number,
    escenarioId: number,
  ): Promise<{ message: string }> {
    await this.buscarTorneo(torneoId);
    const existente = await this.repo.findOne({
      where: { torneoId, escenarioId },
    });
    if (!existente) {
      throw new NotFoundException(
        `El escenario ${escenarioId} no está asignado al torneo ${torneoId}`,
      );
    }
    const partidos = await this.partidoRepo.count({
      where: { torneoId, escenarioId },
    });
    if (partidos) {
      throw new ConflictException(
        `No se puede quitar el escenario ${escenarioId}: tiene ${partidos} partido(s) del torneo ${torneoId}`,
      );
    }
    await this.repo.remove(existente);
    return {
      message: `Escenario ${escenarioId} quitado del torneo ${torneoId}`,
    };
  }

  /** Contrato para B: escenarios disponibles (asignados y activos) de un torneo. */
  async findByTorneo(torneoId: number): Promise<EscenarioTorneoResponseDto[]> {
    await this.buscarTorneo(torneoId);
    const list = await this.repo.find({
      where: { torneoId },
      relations: { escenario: true, torneo: true },
    });
    return this.mapper.toResponseDtoList(
      list.filter((x) => x.escenario?.activo),
    );
  }

  async findByEscenario(
    escenarioId: number,
  ): Promise<EscenarioTorneoResponseDto[]> {
    const escenario = await this.escenarioRepo.findOne({
      where: { id: escenarioId },
    });
    if (!escenario)
      throw new NotFoundException(`Escenario ${escenarioId} no encontrado`);
    const list = await this.repo.find({
      where: { escenarioId },
      relations: { escenario: true, torneo: true },
    });
    return this.mapper.toResponseDtoList(list);
  }

  private async buscarTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneoRepo.findOne({ where: { id } });
    if (!torneo) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return torneo;
  }
}
