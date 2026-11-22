import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { LocalidadResponseDto } from './dto/localidad-response.dto';
import { Localidad } from './entities/localidad.entity';
import { LocalidadMapper } from './mappers/localidad.mapper';
import { Escenario } from '../stubs/entities/escenario.entity';

@Injectable()
export class LocalidadesService {
  constructor(
    @InjectRepository(Localidad)
    private readonly repo: Repository<Localidad>,
    @InjectRepository(Escenario)
    private readonly escenarioRepo: Repository<Escenario>,
    private readonly mapper: LocalidadMapper,
  ) {}

  async create(dto: CreateLocalidadDto): Promise<LocalidadResponseDto> {
    const escenario = await this.escenarioRepo.findOne({ where: { id: dto.escenarioId } });
    if (!escenario) throw new NotFoundException(`Escenario ${dto.escenarioId} no existe`);

    const entity = this.mapper.toEntity(dto);
    const saved = await this.repo.save(entity);
    return this.mapper.toResponseDto({ ...saved, escenario });
  }

  async findByEscenario(escenarioId: number): Promise<LocalidadResponseDto[]> {
    const list = await this.repo.find({
      where: { escenarioId },
      relations: { escenario: true },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async findOne(id: number): Promise<LocalidadResponseDto> {
    const found = await this.repo.findOne({ where: { id }, relations: { escenario: true } });
    if (!found) throw new NotFoundException(`Localidad ${id} no encontrada`);
    return this.mapper.toResponseDto(found);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Localidad ${id} no encontrada`);
    await this.repo.remove(found);
    return { message: `Localidad ${id} eliminada` };
  }
}
