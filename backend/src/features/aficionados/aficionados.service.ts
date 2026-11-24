import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from '../../core/pagination/page-query.dto';
import { PageResponseDto, toPage } from '../../core/pagination/page-response.dto';
import { CreateAficionadoDto } from './dto/create-aficionado.dto';
import { AficionadoResponseDto } from './dto/aficionado-response.dto';
import { UpdateAficionadoDto } from './dto/update-aficionado.dto';
import { Aficionado } from './entities/aficionado.entity';
import { AficionadoMapper } from './mappers/aficionado.mapper';

@Injectable()
export class AficionadosService {
  constructor(
    @InjectRepository(Aficionado)
    private readonly repo: Repository<Aficionado>,
    private readonly mapper: AficionadoMapper,
  ) {}

  async create(dto: CreateAficionadoDto): Promise<AficionadoResponseDto> {
    const existing = await this.repo.findOne({ where: { usuarioId: dto.usuarioId } });
    if (existing) throw new ConflictException(`Ya existe un aficionado con usuarioId ${dto.usuarioId}`);

    const entity = this.mapper.toEntity(dto);
    const saved = await this.repo.save(entity);
    return this.mapper.toResponseDto(saved);
  }

  async findAll(query: PageQueryDto = new PageQueryDto()): Promise<PageResponseDto<AficionadoResponseDto>> {
    const [list, total] = await this.repo.findAndCount({
      order: { id: 'DESC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  async findOne(id: number): Promise<AficionadoResponseDto> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Aficionado ${id} no encontrado`);
    return this.mapper.toResponseDto(found);
  }

  async update(id: number, dto: UpdateAficionadoDto): Promise<AficionadoResponseDto> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Aficionado ${id} no encontrado`);
    const merged = this.mapper.mergeEntity(found, dto);
    const saved = await this.repo.save(merged);
    return this.mapper.toResponseDto(saved);
  }

  async remove(id: number): Promise<{ message: string }> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Aficionado ${id} no encontrado`);
    await this.repo.remove(found);
    return { message: `Aficionado ${id} eliminado` };
  }
}
