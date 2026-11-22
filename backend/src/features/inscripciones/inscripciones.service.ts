import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from '../../core/pagination/page-query.dto';
import {
  PageResponseDto,
  toPage,
} from '../../core/pagination/page-response.dto';
import { hoyISO } from '../../core/utils/fecha.util';
import { EquipoDeporte } from '../equipos-deportes/entities/equipo-deporte.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { InscripcionResponseDto } from './dto/inscripcion-response.dto';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionMapper } from './mappers/inscripcion.mapper';
import { InscripcionValidator } from './validators/inscripcion.validator';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly repo: Repository<Inscripcion>,
    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,
    @InjectRepository(EquipoDeporte)
    private readonly equipoDeporteRepo: Repository<EquipoDeporte>,
    private readonly mapper: InscripcionMapper,
    private readonly validator: InscripcionValidator,
  ) {}

  async inscribir(torneoId: number, equipoId: number): Promise<InscripcionResponseDto> {
    const torneo = await this.validator.buscarTorneo(torneoId);
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo) throw new NotFoundException(`Equipo ${equipoId} no existe`);

    this.validator.validarInscripcionesAbiertas(torneo, 'inscribir equipos');
    if (!equipo.activo) throw new BadRequestException(`El equipo ${equipoId} está inactivo`);

    const asociado = await this.equipoDeporteRepo.findOne({
      where: { equipoId, deporteId: torneo.deporteId },
    });
    if (!asociado) {
      throw new BadRequestException(
        `El equipo ${equipoId} no está asociado al deporte del torneo (deporte ${torneo.deporteId})`,
      );
    }

    const existente = await this.repo.findOne({ where: { torneoId, equipoId } });
    if (existente) {
      throw new ConflictException(`El equipo ${equipoId} ya está inscrito en el torneo ${torneoId}`);
    }

    const saved = await this.repo.save(
      this.repo.create({ torneoId, equipoId, fechaInscripcion: hoyISO(), estado: 'INSCRITO' }),
    );
    return this.mapper.toResponseDto({ ...saved, torneo, equipo });
  }

  async retirar(torneoId: number, equipoId: number): Promise<{ message: string }> {
    const torneo = await this.validator.buscarTorneo(torneoId);
    const inscripcion = await this.repo.findOne({ where: { torneoId, equipoId } });
    if (!inscripcion) {
      throw new NotFoundException(`El equipo ${equipoId} no está inscrito en el torneo ${torneoId}`);
    }
    this.validator.validarInscripcionesAbiertas(torneo, 'retirar equipos');
    await this.validator.validarRetiroSinAsociaciones(torneoId, equipoId);

    await this.repo.remove(inscripcion);
    return { message: `Equipo ${equipoId} retirado del torneo ${torneoId}` };
  }

  async findByTorneo(
    torneoId: number,
    query: PageQueryDto,
  ): Promise<PageResponseDto<InscripcionResponseDto>> {
    await this.validator.buscarTorneo(torneoId);
    const [list, total] = await this.repo.findAndCount({
      where: { torneoId },
      relations: { torneo: true, equipo: true },
      order: { id: 'ASC' },
      skip: query.page * query.size,
      take: query.size,
    });
    return toPage(this.mapper.toResponseDtoList(list), total, query);
  }

  async findEquiposHabilitados(torneoId: number): Promise<InscripcionResponseDto[]> {
    await this.validator.buscarTorneo(torneoId);
    const list = await this.repo.find({
      where: { torneoId },
      relations: { torneo: true, equipo: true },
      order: { id: 'ASC' },
    });
    return this.mapper.toResponseDtoList(list.filter((i) => i.equipo?.activo));
  }

  async findByEquipo(equipoId: number): Promise<InscripcionResponseDto[]> {
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo) throw new NotFoundException(`Equipo ${equipoId} no encontrado`);
    const list = await this.repo.find({
      where: { equipoId },
      relations: { torneo: true, equipo: true },
      order: { id: 'DESC' },
    });
    return this.mapper.toResponseDtoList(list);
  }
}
