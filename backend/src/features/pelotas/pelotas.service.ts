import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePelotaDto } from './dto/create-pelota.dto';
import { PelotaResponseDto } from './dto/pelota-response.dto';
import { UpdatePelotaDto } from './dto/update-pelota.dto';
import { Pelota } from './entities/pelota.entity';
import { PelotaMapper } from './mappers/pelota.mapper';

@Injectable()
export class PelotasService {
  constructor(
    @InjectRepository(Pelota)
    private readonly pelotaRepo: Repository<Pelota>,
    private readonly mapper: PelotaMapper,
  ) {}

  async create(dto: CreatePelotaDto): Promise<PelotaResponseDto> {
    const entity = this.mapper.toEntity(dto);
    const saved = await this.pelotaRepo.save(entity);
    return this.mapper.toResponseDto(saved);
  }

  async findAll(): Promise<PelotaResponseDto[]> {
    const list = await this.pelotaRepo.find();
    return this.mapper.toResponseDtoList(list);
  }

  async findOne(id: number): Promise<PelotaResponseDto> {
    const found = await this.pelotaRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Pelota con ID ${id} no encontrada`);
    return this.mapper.toResponseDto(found);
  }

  async update(id: number, dto: UpdatePelotaDto): Promise<PelotaResponseDto> {
    const found = await this.pelotaRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Pelota con ID ${id} no encontrada`);
    const merged = this.mapper.mergeEntity(found, dto);
    const saved = await this.pelotaRepo.save(merged);
    return this.mapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.pelotaRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Pelota con ID ${id} no encontrada`);
    await this.pelotaRepo.remove(found);
    return { message: `Pelota ${id} eliminada exitosamente` };
  }
}
