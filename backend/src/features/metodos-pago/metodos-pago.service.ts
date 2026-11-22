import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { MetodoPagoResponseDto } from './dto/metodo-pago-response.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { MetodoPago } from './entities/metodo-pago.entity';
import { MetodoPagoMapper } from './mappers/metodo-pago.mapper';
import { MetodoPagoAficionado } from '../metodos-pago-aficionado/entities/metodo-pago-aficionado.entity';

@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly repo: Repository<MetodoPago>,
    @InjectRepository(MetodoPagoAficionado)
    private readonly aficionadoMetodoRepo: Repository<MetodoPagoAficionado>,
  ) {}

  async create(dto: CreateMetodoPagoDto): Promise<MetodoPagoResponseDto> {
    const existing = await this.repo.findOne({ where: { nombre: dto.nombre } });
    if (existing) {
      throw new ConflictException(`Ya existe un método de pago con el nombre ${dto.nombre}`);
    }
    const created = this.repo.create(dto);
    const saved = await this.repo.save(created);
    return MetodoPagoMapper.toResponse(saved);
  }

  async findAll(): Promise<MetodoPagoResponseDto[]> {
    const list = await this.repo.find({ order: { nombre: 'ASC' } });
    return MetodoPagoMapper.toResponseList(list);
  }

  async findOne(id: number): Promise<MetodoPagoResponseDto> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Método de pago ${id} no encontrado`);
    }
    return MetodoPagoMapper.toResponse(entity);
  }

  async update(id: number, dto: UpdateMetodoPagoDto): Promise<MetodoPagoResponseDto> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Método de pago ${id} no encontrado`);
    }
    if (dto.nombre && dto.nombre !== entity.nombre) {
      const duplicate = await this.repo.findOne({ where: { nombre: dto.nombre } });
      if (duplicate) {
        throw new ConflictException(`Ya existe otro método de pago con el nombre ${dto.nombre}`);
      }
    }
    Object.assign(entity, dto);
    const saved = await this.repo.save(entity);
    return MetodoPagoMapper.toResponse(saved);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Método de pago ${id} no encontrado`);
    }
    const count = await this.aficionadoMetodoRepo.count({ where: { metodoPagoId: id } });
    if (count > 0) {
      throw new ConflictException(
        `No se puede eliminar el método de pago porque está asociado a ${count} aficionado(s)`,
      );
    }
    await this.repo.remove(entity);
    return { success: true, message: `Método de pago ${id} eliminado correctamente` };
  }
}
