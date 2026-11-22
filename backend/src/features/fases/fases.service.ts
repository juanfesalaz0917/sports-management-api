import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaseFinal } from '../fases-finales/entities/fase-final.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { CreateFaseDto } from './dto/create-fase.dto';
import { FaseResponseDto } from './dto/fase-response.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';
import { Fase } from './entities/fase.entity';
import { FaseMapper, normalizarTipo } from './mappers/fase.mapper';

@Injectable()
export class FasesService {
  constructor(
    @InjectRepository(Fase)
    private readonly repo: Repository<Fase>,
    @InjectRepository(Torneo)
    private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,
    @InjectRepository(FaseFinal)
    private readonly faseFinalRepo: Repository<FaseFinal>,
    @InjectRepository(Partido)
    private readonly partidoRepo: Repository<Partido>,
    private readonly mapper: FaseMapper,
  ) {}

  async create(torneoId: number, dto: CreateFaseDto): Promise<FaseResponseDto> {
    const torneo = await this.buscarTorneo(torneoId);
    this.validarTorneoModificable(torneo);

    // Si no se indica orden, la fase queda al final de las existentes
    const orden = dto.orden ?? (await this.siguienteOrden(torneoId));
    await this.validarOrdenUnico(torneoId, orden);

    const saved = await this.repo.save(
      this.mapper.toEntity(torneoId, orden, dto),
    );
    return this.mapper.toResponseDto({ ...saved, torneo });
  }

  async findByTorneo(torneoId: number): Promise<FaseResponseDto[]> {
    await this.buscarTorneo(torneoId);
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
    this.validarTorneoModificable(found.torneo);

    if (dto.tipo !== undefined && normalizarTipo(dto.tipo) !== found.tipo) {
      const asociaciones = await this.contarAsociaciones(id);
      if (asociaciones.length) {
        throw new ConflictException(
          `No se puede cambiar el tipo de la fase ${id}: tiene ${asociaciones.join(', ')} asociado(s)`,
        );
      }
      found.tipo = normalizarTipo(dto.tipo);
    }
    if (dto.orden !== undefined && dto.orden !== found.orden) {
      await this.validarOrdenUnico(Number(found.torneoId), dto.orden, id);
      found.orden = dto.orden;
    }
    if (dto.nombre !== undefined) found.nombre = dto.nombre.trim();

    found.torneo = undefined as never;
    await this.repo.save(found);
    return this.findOne(id);
  }

  /** Eliminar la fase no elimina el torneo; se bloquea si tiene información asociada. */
  async remove(id: number): Promise<{ message: string }> {
    const found = await this.buscar(id);
    const asociaciones = await this.contarAsociaciones(id);
    if (asociaciones.length) {
      throw new ConflictException(
        `No se puede eliminar la fase ${id}: tiene ${asociaciones.join(', ')} asociado(s)`,
      );
    }
    await this.repo.remove(found);
    return { message: `Fase ${id} eliminada` };
  }

  // --- reglas internas ---

  private async buscar(id: number): Promise<Fase> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { torneo: true },
    });
    if (!found) throw new NotFoundException(`Fase ${id} no encontrada`);
    return found;
  }

  private async buscarTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneoRepo.findOne({ where: { id } });
    if (!torneo) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return torneo;
  }

  private validarTorneoModificable(torneo: Torneo): void {
    if (torneo.estado === 'FINALIZADO' || torneo.estado === 'CANCELADO') {
      throw new ConflictException(
        `No se pueden modificar las fases de un torneo ${torneo.estado}`,
      );
    }
  }

  private async siguienteOrden(torneoId: number): Promise<number> {
    const ultima = await this.repo.findOne({
      where: { torneoId },
      order: { orden: 'DESC' },
    });
    return ultima ? ultima.orden + 1 : 1;
  }

  private async validarOrdenUnico(
    torneoId: number,
    orden: number,
    excluirId?: number,
  ): Promise<void> {
    const existentes = await this.repo.find({ where: { torneoId, orden } });
    if (existentes.some((f) => Number(f.id) !== excluirId)) {
      throw new ConflictException(
        `El torneo ${torneoId} ya tiene una fase con orden ${orden}`,
      );
    }
  }

  private async contarAsociaciones(faseId: number): Promise<string[]> {
    const [grupos, finales, partidos] = await Promise.all([
      this.grupoRepo.count({ where: { faseId } }),
      this.faseFinalRepo.count({ where: { faseId } }),
      this.partidoRepo.count({ where: { faseId } }),
    ]);
    const motivos: string[] = [];
    if (grupos) motivos.push(`${grupos} grupo(s)`);
    if (finales) motivos.push('configuración de fase final');
    if (partidos) motivos.push(`${partidos} partido(s)`);
    return motivos;
  }
}
