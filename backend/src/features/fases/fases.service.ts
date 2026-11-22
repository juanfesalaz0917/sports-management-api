import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFaseDto } from './dto/create-fase.dto';
import { FaseResponseDto } from './dto/fase-response.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';
import { Fase } from './entities/fase.entity';
import { FaseMapper, normalizarTipo } from './mappers/fase.mapper';
import { FaseValidator } from './validators/fase.validator';

@Injectable()
export class FasesService {
  constructor(
    @InjectRepository(Fase) private readonly repo: Repository<Fase>,
    private readonly mapper: FaseMapper,
    private readonly validator: FaseValidator,
  ) {}

  async create(torneoId: number, dto: CreateFaseDto): Promise<FaseResponseDto> {
    const torneo = await this.validator.buscarTorneo(torneoId);
    this.validator.validarTorneoModificable(torneo);
    const orden = dto.orden ?? (await this.validator.siguienteOrden(torneoId));
    await this.validator.validarOrdenUnico(torneoId, orden);

    const saved = await this.repo.save(this.mapper.toEntity(torneoId, orden, dto));
    return this.mapper.toResponseDto({ ...saved, torneo });
  }

  async findByTorneo(torneoId: number): Promise<FaseResponseDto[]> {
    await this.validator.buscarTorneo(torneoId);
    const list = await this.repo.find({
      where: { torneoId },
      relations: { torneo: true },
      order: { orden: 'ASC', id: 'ASC' },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async findOne(id: number): Promise<FaseResponseDto> {
    return this.mapper.toResponseDto(await this.buscar(id));
  }

  async update(id: number, dto: UpdateFaseDto): Promise<FaseResponseDto> {
    const found = await this.buscar(id);
    this.validator.validarTorneoModificable(found.torneo);

    if (dto.tipo !== undefined && normalizarTipo(dto.tipo) !== found.tipo) {
      const asociaciones = await this.validator.contarAsociaciones(id);
      if (asociaciones.length) {
        throw new ConflictException(`No se puede cambiar el tipo de la fase ${id}: tiene ${asociaciones.join(', ')} asociado(s)`);
      }
      found.tipo = normalizarTipo(dto.tipo);
    }
    if (dto.orden !== undefined && dto.orden !== found.orden) {
      await this.validator.validarOrdenUnico(Number(found.torneoId), dto.orden, id);
      found.orden = dto.orden;
    }
    if (dto.nombre !== undefined) found.nombre = dto.nombre.trim();

    found.torneo = undefined as never;
    await this.repo.save(found);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.buscar(id);
    const asociaciones = await this.validator.contarAsociaciones(id);
    if (asociaciones.length) {
      throw new ConflictException(`No se puede eliminar la fase ${id}: tiene ${asociaciones.join(', ')} asociado(s)`);
    }
    await this.repo.remove(found);
    return { message: `Fase ${id} eliminada` };
  }

  private async buscar(id: number): Promise<Fase> {
    const found = await this.repo.findOne({ where: { id }, relations: { torneo: true } });
    if (!found) throw new NotFoundException(`Fase ${id} no encontrada`);
    return found;
  }
}
