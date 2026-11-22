import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHabilidadDto } from './dto/create-habilidad.dto';
import { HabilidadResponseDto } from './dto/habilidad-response.dto';
import { UpdateHabilidadDto } from './dto/update-habilidad.dto';
import { Habilidad } from './entities/habilidad.entity';
import { HabilidadMapper } from './mappers/habilidad.mapper';
import { HabilidadJugador } from '../habilidades-jugador/entities/habilidad-jugador.entity';

@Injectable()
export class HabilidadesService {
  constructor(
    @InjectRepository(Habilidad)
    private readonly repo: Repository<Habilidad>,
    @InjectRepository(HabilidadJugador)
    private readonly hjRepo: Repository<HabilidadJugador>,
  ) {}

  async create(dto: CreateHabilidadDto): Promise<HabilidadResponseDto> {
    const existing = await this.repo.findOne({ where: { nombre: dto.nombre } });
    if (existing) {
      throw new ConflictException(`Ya existe una habilidad con el nombre ${dto.nombre}`);
    }
    const created = this.repo.create(dto);
    const saved = await this.repo.save(created);
    return HabilidadMapper.toResponse(saved);
  }

  async findAll(): Promise<HabilidadResponseDto[]> {
    const list = await this.repo.find({ order: { nombre: 'ASC' } });
    return HabilidadMapper.toResponseList(list);
  }

  async findOne(id: number): Promise<HabilidadResponseDto> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Habilidad ${id} no encontrada`);
    }
    return HabilidadMapper.toResponse(entity);
  }

  async update(id: number, dto: UpdateHabilidadDto): Promise<HabilidadResponseDto> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Habilidad ${id} no encontrada`);
    }
    if (dto.nombre && dto.nombre !== entity.nombre) {
      const duplicate = await this.repo.findOne({ where: { nombre: dto.nombre } });
      if (duplicate) {
        throw new ConflictException(`Ya existe otra habilidad con el nombre ${dto.nombre}`);
      }
    }
    Object.assign(entity, dto);
    const saved = await this.repo.save(entity);
    return HabilidadMapper.toResponse(saved);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Habilidad ${id} no encontrada`);
    }
    const associatedCount = await this.hjRepo.count({ where: { habilidadId: id } });
    if (associatedCount > 0) {
      throw new ConflictException(
        `No se puede eliminar la habilidad porque está asignada a ${associatedCount} jugador(es)`,
      );
    }
    await this.repo.remove(entity);
    return { success: true, message: `Habilidad ${id} eliminada correctamente` };
  }
}
