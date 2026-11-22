import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import {
  GrupoEquipoResponseDto,
  GrupoResponseDto,
} from './dto/grupo-response.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { GrupoEquipo } from './entities/grupo-equipo.entity';
import { Grupo } from './entities/grupo.entity';
import { GrupoMapper } from './mappers/grupo.mapper';
import { GrupoValidator } from './validators/grupo.validator';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly repo: Repository<Grupo>,
    @InjectRepository(GrupoEquipo)
    private readonly grupoEquipoRepo: Repository<GrupoEquipo>,
    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    private readonly mapper: GrupoMapper,
    private readonly validator: GrupoValidator,
  ) {}

  async create(faseId: number, dto: CreateGrupoDto): Promise<GrupoResponseDto> {
    const fase = await this.validator.buscarFase(faseId);
    if (fase.tipo !== 'GRUPO') {
      throw new BadRequestException(
        `La fase ${faseId} es de tipo ${fase.tipo}: solo las fases de grupos admiten grupos`,
      );
    }
    this.validator.validarTorneoModificable(fase);
    await this.validator.validarNombreUnico(faseId, dto.nombreGrupo);
    const saved = await this.repo.save(
      this.repo.create({ faseId, nombreGrupo: dto.nombreGrupo.trim() }),
    );
    return this.mapper.toResponseDto({ ...saved, fase }, 0);
  }

  async findByFase(faseId: number): Promise<GrupoResponseDto[]> {
    const fase = await this.validator.buscarFase(faseId);
    const grupos = await this.repo.find({ where: { faseId }, order: { id: 'ASC' } });
    return Promise.all(
      grupos.map(async (g) =>
        this.mapper.toResponseDto(
          { ...g, fase },
          await this.grupoEquipoRepo.count({ where: { grupoId: g.id } }),
        ),
      ),
    );
  }

  async findOne(id: number): Promise<GrupoResponseDto> {
    const grupo = await this.buscar(id);
    const total = await this.grupoEquipoRepo.count({ where: { grupoId: id } });
    return this.mapper.toResponseDto(grupo, total);
  }

  async update(id: number, dto: UpdateGrupoDto): Promise<GrupoResponseDto> {
    const grupo = await this.buscar(id);
    this.validator.validarTorneoModificable(grupo.fase);
    if (dto.nombreGrupo !== undefined && dto.nombreGrupo.trim() !== grupo.nombreGrupo) {
      await this.validator.validarNombreUnico(Number(grupo.faseId), dto.nombreGrupo, id);
      grupo.nombreGrupo = dto.nombreGrupo.trim();
    }
    const fase = grupo.fase;
    grupo.fase = undefined as never;
    await this.repo.save(grupo);
    grupo.fase = fase;
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const grupo = await this.buscar(id);
    this.validator.validarTorneoModificable(grupo.fase);
    await this.grupoEquipoRepo.delete({ grupoId: id });
    await this.repo.delete({ id });
    return { message: `Grupo ${id} eliminado` };
  }

  async findEquipos(grupoId: number): Promise<GrupoEquipoResponseDto[]> {
    await this.buscar(grupoId);
    const list = await this.grupoEquipoRepo.find({
      where: { grupoId },
      relations: { equipo: true },
    });
    return this.mapper.toEquipoResponseDtoList(list);
  }

  async agregarEquipo(grupoId: number, equipoId: number): Promise<GrupoEquipoResponseDto> {
    const grupo = await this.buscar(grupoId);
    this.validator.validarTorneoModificable(grupo.fase);
    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo) throw new NotFoundException(`Equipo ${equipoId} no existe`);

    const inscrito = await this.inscripcionRepo.findOne({
      where: { torneoId: grupo.fase.torneoId, equipoId },
    });
    if (!inscrito) {
      throw new BadRequestException(
        `El equipo ${equipoId} no está inscrito en el torneo ${grupo.fase.torneoId}`,
      );
    }

    const mismo = await this.grupoEquipoRepo.findOne({ where: { grupoId, equipoId } });
    if (mismo) throw new ConflictException(`El equipo ${equipoId} ya está en el grupo ${grupoId}`);
    const otro = await this.grupoEquipoRepo.findOne({ where: { faseId: grupo.faseId, equipoId } });
    if (otro) {
      throw new ConflictException(
        `El equipo ${equipoId} ya pertenece al grupo ${otro.grupoId} de la misma fase`,
      );
    }

    await this.grupoEquipoRepo.save(
      this.grupoEquipoRepo.create({ grupoId, equipoId, faseId: grupo.faseId }),
    );
    return this.mapper.toEquipoResponseDto({ grupoId, equipoId, faseId: grupo.faseId, grupo, equipo });
  }

  async quitarEquipo(grupoId: number, equipoId: number): Promise<{ message: string }> {
    const grupo = await this.buscar(grupoId);
    this.validator.validarTorneoModificable(grupo.fase);
    const miembro = await this.grupoEquipoRepo.findOne({ where: { grupoId, equipoId } });
    if (!miembro) throw new NotFoundException(`El equipo ${equipoId} no está en el grupo ${grupoId}`);
    await this.grupoEquipoRepo.remove(miembro);
    return { message: `Equipo ${equipoId} quitado del grupo ${grupoId}` };
  }

  private async buscar(id: number): Promise<Grupo> {
    const grupo = await this.repo.findOne({
      where: { id },
      relations: { fase: { torneo: true } },
    });
    if (!grupo) throw new NotFoundException(`Grupo ${id} no encontrado`);
    return grupo;
  }
}
