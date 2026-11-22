import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Fase } from '../fases/entities/fase.entity';
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

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly repo: Repository<Grupo>,
    @InjectRepository(GrupoEquipo)
    private readonly grupoEquipoRepo: Repository<GrupoEquipo>,
    @InjectRepository(Fase)
    private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    private readonly mapper: GrupoMapper,
  ) {}

  async create(faseId: number, dto: CreateGrupoDto): Promise<GrupoResponseDto> {
    const fase = await this.buscarFase(faseId);
    if (fase.tipo !== 'GRUPO') {
      throw new BadRequestException(
        `La fase ${faseId} es de tipo ${fase.tipo}: solo las fases de grupos admiten grupos`,
      );
    }
    this.validarTorneoModificable(fase);
    await this.validarNombreUnico(faseId, dto.nombreGrupo);

    const saved = await this.repo.save(
      this.repo.create({ faseId, nombreGrupo: dto.nombreGrupo.trim() }),
    );
    return this.mapper.toResponseDto({ ...saved, fase }, 0);
  }

  async findByFase(faseId: number): Promise<GrupoResponseDto[]> {
    const fase = await this.buscarFase(faseId);
    const grupos = await this.repo.find({
      where: { faseId },
      order: { id: 'ASC' },
    });
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
    this.validarTorneoModificable(grupo.fase);
    if (
      dto.nombreGrupo !== undefined &&
      dto.nombreGrupo.trim() !== grupo.nombreGrupo
    ) {
      await this.validarNombreUnico(Number(grupo.faseId), dto.nombreGrupo, id);
      grupo.nombreGrupo = dto.nombreGrupo.trim();
    }
    const fase = grupo.fase;
    grupo.fase = undefined as never;
    await this.repo.save(grupo);
    grupo.fase = fase;
    return this.findOne(id);
  }

  /** Borrar el grupo solo elimina la pertenencia de sus equipos, no los equipos. */
  async remove(id: number): Promise<{ message: string }> {
    const grupo = await this.buscar(id);
    this.validarTorneoModificable(grupo.fase);
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

  async agregarEquipo(
    grupoId: number,
    equipoId: number,
  ): Promise<GrupoEquipoResponseDto> {
    const grupo = await this.buscar(grupoId);
    this.validarTorneoModificable(grupo.fase);
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

    const mismoGrupo = await this.grupoEquipoRepo.findOne({
      where: { grupoId, equipoId },
    });
    if (mismoGrupo) {
      throw new ConflictException(
        `El equipo ${equipoId} ya está en el grupo ${grupoId}`,
      );
    }
    const otroGrupo = await this.grupoEquipoRepo.findOne({
      where: { faseId: grupo.faseId, equipoId },
    });
    if (otroGrupo) {
      throw new ConflictException(
        `El equipo ${equipoId} ya pertenece al grupo ${otroGrupo.grupoId} de la misma fase`,
      );
    }

    await this.grupoEquipoRepo.save(
      this.grupoEquipoRepo.create({ grupoId, equipoId, faseId: grupo.faseId }),
    );
    return this.mapper.toEquipoResponseDto({
      grupoId,
      equipoId,
      faseId: grupo.faseId,
      grupo,
      equipo,
    });
  }

  async quitarEquipo(
    grupoId: number,
    equipoId: number,
  ): Promise<{ message: string }> {
    const grupo = await this.buscar(grupoId);
    this.validarTorneoModificable(grupo.fase);
    const miembro = await this.grupoEquipoRepo.findOne({
      where: { grupoId, equipoId },
    });
    if (!miembro) {
      throw new NotFoundException(
        `El equipo ${equipoId} no está en el grupo ${grupoId}`,
      );
    }
    await this.grupoEquipoRepo.remove(miembro);
    return { message: `Equipo ${equipoId} quitado del grupo ${grupoId}` };
  }

  // --- reglas internas ---

  private async buscar(id: number): Promise<Grupo> {
    const grupo = await this.repo.findOne({
      where: { id },
      relations: { fase: { torneo: true } },
    });
    if (!grupo) throw new NotFoundException(`Grupo ${id} no encontrado`);
    return grupo;
  }

  private async buscarFase(id: number): Promise<Fase> {
    const fase = await this.faseRepo.findOne({
      where: { id },
      relations: { torneo: true },
    });
    if (!fase) throw new NotFoundException(`Fase ${id} no encontrada`);
    return fase;
  }

  private validarTorneoModificable(fase: Fase): void {
    const estado = fase.torneo?.estado;
    if (estado === 'FINALIZADO' || estado === 'CANCELADO') {
      throw new ConflictException(
        `No se pueden modificar los grupos de un torneo ${estado}`,
      );
    }
  }

  private async validarNombreUnico(
    faseId: number,
    nombre: string,
    excluirId?: number,
  ): Promise<void> {
    const existentes = await this.repo.find({
      where: { faseId, nombreGrupo: nombre.trim() },
    });
    if (existentes.some((g) => Number(g.id) !== excluirId)) {
      throw new ConflictException(
        `Ya existe un grupo "${nombre}" en la fase ${faseId}`,
      );
    }
  }
}
