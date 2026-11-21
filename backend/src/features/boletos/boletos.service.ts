import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { BoletoResponseDto } from './dto/boleto-response.dto';
import { Boleto } from './entities/boleto.entity';
import { BoletoMapper } from './mappers/boleto.mapper';
import { Localidad } from '../localidades/entities/localidad.entity';
import { Partido } from '../partidos/entities/partido.entity';

@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto) private readonly repo: Repository<Boleto>,
    @InjectRepository(Partido) private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(Localidad) private readonly localidadRepo: Repository<Localidad>,
    private readonly mapper: BoletoMapper,
  ) {}

  async create(dto: CreateBoletoDto): Promise<BoletoResponseDto> {
    const partido = await this.partidoRepo.findOne({ where: { id: dto.partidoId } });
    if (!partido) throw new NotFoundException(`Partido ${dto.partidoId} no encontrado`);

    const localidad = await this.localidadRepo.findOne({ where: { id: dto.localidadId } });
    if (!localidad) throw new NotFoundException(`Localidad ${dto.localidadId} no encontrada`);

    const entity = this.mapper.toEntity(dto);
    const saved = await this.repo.save(entity);
    return this.mapper.toResponseDto({ ...saved, partido, localidad });
  }

  async findByPartido(partidoId: number): Promise<BoletoResponseDto[]> {
    const list = await this.repo.find({
      where: { partidoId },
      relations: { aficionado: true, localidad: true },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async findByAficionado(aficionadoId: number): Promise<BoletoResponseDto[]> {
    const list = await this.repo.find({
      where: { aficionadoId },
      relations: { partido: true, localidad: true },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async updateEstado(id: number, estado: string): Promise<BoletoResponseDto> {
    const boleto = await this.repo.findOne({
      where: { id },
      relations: { aficionado: true, localidad: true },
    });
    if (!boleto) throw new NotFoundException(`Boleto ${id} no encontrado`);
    boleto.estado = estado;
    const saved = await this.repo.save(boleto);
    return this.mapper.toResponseDto(saved);
  }
}
