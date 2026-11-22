import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deporte } from '../deportes/entities/deporte.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { EquipoDeporteResponseDto } from './dto/equipo-deporte-response.dto';
import { EquipoDeporte } from './entities/equipo-deporte.entity';
import { EquipoDeporteMapper } from './mappers/equipo-deporte.mapper';

@Injectable()
export class EquiposDeportesService {
  constructor(
    @InjectRepository(EquipoDeporte)
    private readonly repo: Repository<EquipoDeporte>,
    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,
    @InjectRepository(Deporte)
    private readonly deporteRepo: Repository<Deporte>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    private readonly mapper: EquipoDeporteMapper,
  ) {}

  async asociar(
    equipoId: number,
    deporteId: number,
  ): Promise<EquipoDeporteResponseDto> {
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo) throw new NotFoundException(`Equipo ${equipoId} no existe`);
    const deporte = await this.deporteRepo.findOne({
      where: { id: deporteId },
    });
    if (!deporte) throw new NotFoundException(`Deporte ${deporteId} no existe`);
    if (!equipo.activo)
      throw new BadRequestException(`El equipo ${equipoId} está inactivo`);
    if (!deporte.activo)
      throw new BadRequestException(`El deporte ${deporteId} está inactivo`);

    const existente = await this.repo.findOne({
      where: { equipoId, deporteId },
    });
    if (existente) {
      throw new ConflictException(
        `El equipo ${equipoId} ya está asociado al deporte ${deporteId}`,
      );
    }
    await this.repo.save(this.repo.create({ equipoId, deporteId }));
    return this.mapper.toResponseDto({ equipoId, deporteId, equipo, deporte });
  }

  /** Quitar la asociación no elimina ni el equipo ni el deporte. */
  async desasociar(
    equipoId: number,
    deporteId: number,
  ): Promise<{ message: string }> {
    const existente = await this.repo.findOne({
      where: { equipoId, deporteId },
    });
    if (!existente) {
      throw new NotFoundException(
        `El equipo ${equipoId} no está asociado al deporte ${deporteId}`,
      );
    }
    const inscripciones = await this.inscripcionRepo
      .createQueryBuilder('i')
      .innerJoin('i.torneo', 't')
      .where('i.equipoId = :equipoId', { equipoId })
      .andWhere('t.deporteId = :deporteId', { deporteId })
      .getCount();
    if (inscripciones) {
      throw new ConflictException(
        `No se puede quitar el deporte ${deporteId}: el equipo ${equipoId} está inscrito en ${inscripciones} torneo(s) de ese deporte`,
      );
    }
    await this.repo.remove(existente);
    return {
      message: `Equipo ${equipoId} desasociado del deporte ${deporteId}`,
    };
  }

  async findDeportesByEquipo(
    equipoId: number,
  ): Promise<EquipoDeporteResponseDto[]> {
    await this.verificarEquipo(equipoId);
    const list = await this.repo.find({
      where: { equipoId },
      relations: { equipo: true, deporte: true },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async findEquiposByDeporte(
    deporteId: number,
  ): Promise<EquipoDeporteResponseDto[]> {
    const deporte = await this.deporteRepo.findOne({
      where: { id: deporteId },
    });
    if (!deporte)
      throw new NotFoundException(`Deporte ${deporteId} no encontrado`);
    const list = await this.repo.find({
      where: { deporteId },
      relations: { equipo: true, deporte: true },
    });
    return this.mapper.toResponseDtoList(list);
  }

  private async verificarEquipo(equipoId: number): Promise<void> {
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo)
      throw new NotFoundException(`Equipo ${equipoId} no encontrado`);
  }
}
