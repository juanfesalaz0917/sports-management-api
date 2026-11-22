import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Fase } from '../fases/entities/fase.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import {
  CreateFaseFinalDto,
  FaseFinalResponseDto,
  UpdateFaseFinalDto,
} from './dto/fase-final.dto';
import { FaseFinal } from './entities/fase-final.entity';
import { FaseFinalMapper } from './mappers/fase-final.mapper';

/** Fase final del torneo (llaves). Un torneo tiene como máximo una. */
@Injectable()
export class FasesFinalesService {
  constructor(
    @InjectRepository(FaseFinal)
    private readonly repo: Repository<FaseFinal>,
    @InjectRepository(Fase)
    private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Torneo)
    private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(Partido)
    private readonly partidoRepo: Repository<Partido>,
    private readonly mapper: FaseFinalMapper,
  ) {}

  async create(
    torneoId: number,
    dto: CreateFaseFinalDto,
  ): Promise<FaseFinalResponseDto> {
    const torneo = await this.buscarTorneo(torneoId);
    if (torneo.estado === 'FINALIZADO' || torneo.estado === 'CANCELADO') {
      throw new ConflictException(
        `No se puede configurar la fase final de un torneo ${torneo.estado}`,
      );
    }

    const fase = await this.faseRepo.findOne({ where: { id: dto.faseId } });
    if (!fase) throw new NotFoundException(`Fase ${dto.faseId} no existe`);
    if (Number(fase.torneoId) !== torneoId) {
      throw new BadRequestException(
        `La fase ${dto.faseId} no pertenece al torneo ${torneoId}`,
      );
    }
    if (fase.tipo !== 'FINAL') {
      throw new BadRequestException(
        `La fase ${dto.faseId} es de tipo ${fase.tipo}, no FINAL`,
      );
    }

    const existente = await this.buscarPorTorneo(torneoId);
    if (existente) {
      throw new ConflictException(
        `El torneo ${torneoId} ya tiene una fase final (fase ${existente.faseId})`,
      );
    }

    await this.repo.save(
      this.repo.create({ faseId: dto.faseId, modalidad: dto.modalidad }),
    );
    return this.mapper.toResponseDto({
      faseId: dto.faseId,
      modalidad: dto.modalidad,
      fase,
    });
  }

  async findByTorneo(torneoId: number): Promise<FaseFinalResponseDto> {
    await this.buscarTorneo(torneoId);
    const found = await this.buscarPorTorneo(torneoId);
    if (!found)
      throw new NotFoundException(
        `El torneo ${torneoId} no tiene fase final configurada`,
      );
    return this.mapper.toResponseDto(found);
  }

  /** Solo se modifica mientras ningún partido de la fase haya comenzado. */
  async update(
    torneoId: number,
    dto: UpdateFaseFinalDto,
  ): Promise<FaseFinalResponseDto> {
    await this.buscarTorneo(torneoId);
    const found = await this.buscarPorTorneo(torneoId);
    if (!found)
      throw new NotFoundException(
        `El torneo ${torneoId} no tiene fase final configurada`,
      );
    await this.validarSinPartidosIniciados(Number(found.faseId));

    found.modalidad = dto.modalidad;
    await this.repo.save({ faseId: found.faseId, modalidad: found.modalidad });
    return this.mapper.toResponseDto(found);
  }

  async remove(torneoId: number): Promise<{ message: string }> {
    await this.buscarTorneo(torneoId);
    const found = await this.buscarPorTorneo(torneoId);
    if (!found)
      throw new NotFoundException(
        `El torneo ${torneoId} no tiene fase final configurada`,
      );
    const partidos = await this.partidoRepo.count({
      where: { faseId: found.faseId },
    });
    if (partidos) {
      throw new ConflictException(
        `No se puede quitar la fase final: la fase ${found.faseId} tiene ${partidos} partido(s)`,
      );
    }
    await this.repo.delete({ faseId: found.faseId });
    return { message: `Fase final del torneo ${torneoId} eliminada` };
  }

  // --- reglas internas ---

  private async buscarTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneoRepo.findOne({ where: { id } });
    if (!torneo) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return torneo;
  }

  private buscarPorTorneo(torneoId: number): Promise<FaseFinal | null> {
    return this.repo
      .createQueryBuilder('ff')
      .innerJoinAndSelect('ff.fase', 'f')
      .where('f.torneoId = :torneoId', { torneoId })
      .getOne();
  }

  private async validarSinPartidosIniciados(faseId: number): Promise<void> {
    const iniciados = await this.partidoRepo.count({
      where: { faseId, estado: In(['EN_CURSO', 'FINALIZADO']) },
    });
    if (iniciados) {
      throw new ConflictException(
        `No se puede modificar la fase final: tiene ${iniciados} partido(s) en curso o finalizados`,
      );
    }
  }
}
