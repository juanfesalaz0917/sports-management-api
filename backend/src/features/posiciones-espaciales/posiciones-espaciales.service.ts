import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePosicionEspacialDto } from './dto/create-posicion.dto';
import { PosicionEspacialResponseDto } from './dto/posicion-response.dto';
import { PosicionEspacial } from './entities/posicion-espacial.entity';
import { PosicionMapper } from './mappers/posicion.mapper';

@Injectable()
export class PosicionesEspacialesService {
  constructor(
    @InjectRepository(PosicionEspacial)
    private readonly repo: Repository<PosicionEspacial>,
    private readonly mapper: PosicionMapper,
  ) {}

  async create(dto: CreatePosicionEspacialDto): Promise<PosicionEspacialResponseDto> {
    const entity = this.mapper.toEntity(dto);
    const saved = await this.repo.save(entity);
    return this.mapper.toResponseDto(saved);
  }

  async findAll(): Promise<PosicionEspacialResponseDto[]> {
    const list = await this.repo.find();
    return this.mapper.toResponseDtoList(list);
  }

  async findOne(id: number): Promise<PosicionEspacialResponseDto> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Posición espacial ${id} no encontrada`);
    return this.mapper.toResponseDto(found);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Posición espacial ${id} no encontrada`);
    await this.repo.remove(found);
    return { message: `Posición espacial ${id} eliminada` };
  }
}
