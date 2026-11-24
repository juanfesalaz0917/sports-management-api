import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetodoPagoAficionadoDto } from './dto/create-metodo-pago-aficionado.dto';
import { MetodoPagoAficionadoResponseDto } from './dto/metodo-pago-aficionado-response.dto';
import { MetodoPagoAficionado } from './entities/metodo-pago-aficionado.entity';
import { MetodoPagoAficionadoMapper } from './mappers/metodo-pago-aficionado.mapper';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';

@Injectable()
export class MetodosPagoAficionadoService {
  constructor(
    @InjectRepository(MetodoPagoAficionado)
    private readonly repo: Repository<MetodoPagoAficionado>,
    @InjectRepository(Aficionado)
    private readonly aficionadoRepo: Repository<Aficionado>,
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepo: Repository<MetodoPago>,
    private readonly mapper: MetodoPagoAficionadoMapper,
  ) {}

  async create(aficionadoId: number, dto: CreateMetodoPagoAficionadoDto): Promise<MetodoPagoAficionadoResponseDto> {
    const aficionado = await this.aficionadoRepo.findOne({ where: { id: aficionadoId } });
    if (!aficionado) throw new NotFoundException(`Aficionado ${aficionadoId} no encontrado`);

    const metodoPago = await this.metodoPagoRepo.findOne({ where: { id: dto.metodoPagoId } });
    if (!metodoPago) throw new NotFoundException(`Tipo de método de pago ${dto.metodoPagoId} no existe`);

    const duplicate = await this.repo.findOne({ where: { aficionadoId, metodoPagoId: dto.metodoPagoId, referencia: dto.referencia } });
    if (duplicate) throw new ConflictException('Este método de pago ya está asociado al aficionado');

    const entity = this.mapper.toEntity(aficionadoId, dto);
    const saved = await this.repo.save(entity);
    return this.mapper.toResponseDto({ ...saved, aficionado, metodoPago });
  }

  async findByAficionado(aficionadoId: number): Promise<MetodoPagoAficionadoResponseDto[]> {
    const aficionado = await this.aficionadoRepo.findOne({ where: { id: aficionadoId } });
    if (!aficionado) throw new NotFoundException(`Aficionado ${aficionadoId} no encontrado`);
    const list = await this.repo.find({
      where: { aficionadoId },
      relations: { aficionado: true, metodoPago: true },
    });
    return this.mapper.toResponseDtoList(list);
  }

  async update(aficionadoId: number, id: number, dto: Partial<CreateMetodoPagoAficionadoDto>): Promise<MetodoPagoAficionadoResponseDto> {
    const found = await this.repo.findOne({ where: { id, aficionadoId }, relations: { aficionado: true, metodoPago: true } });
    if (!found) throw new NotFoundException(`Método de pago ${id} no encontrado para este aficionado`);
    if (dto.metodoPagoId !== undefined) {
      const metodoPago = await this.metodoPagoRepo.findOne({ where: { id: dto.metodoPagoId } });
      if (!metodoPago) throw new NotFoundException(`Tipo de método de pago ${dto.metodoPagoId} no existe`);
      found.metodoPagoId = dto.metodoPagoId;
      found.metodoPago = metodoPago;
    }
    if (dto.referencia !== undefined) found.referencia = dto.referencia;
    const saved = await this.repo.save(found);
    return this.mapper.toResponseDto(saved);
  }

  async remove(aficionadoId: number, id: number): Promise<{ message: string }> {
    const found = await this.repo.findOne({ where: { id, aficionadoId } });
    if (!found) throw new NotFoundException(`Método de pago ${id} no encontrado para este aficionado`);
    await this.repo.remove(found);
    return { message: 'Método de pago eliminado' };
  }

  async removeById(id: number): Promise<{ message: string }> {
    return this.remove((await this.repo.findOne({ where: { id } }))?.aficionadoId ?? -1, id);
  }
}
