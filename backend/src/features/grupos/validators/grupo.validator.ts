import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fase } from '../../fases/entities/fase.entity';
import { Grupo } from '../entities/grupo.entity';

@Injectable()
export class GrupoValidator {
  constructor(
    @InjectRepository(Grupo)
    private readonly repo: Repository<Grupo>,
    @InjectRepository(Fase)
    private readonly faseRepo: Repository<Fase>,
  ) {}

  async buscarFase(id: number): Promise<Fase> {
    const fase = await this.faseRepo.findOne({
      where: { id },
      relations: { torneo: true },
    });
    if (!fase) throw new NotFoundException(`Fase ${id} no encontrada`);
    return fase;
  }

  validarTorneoModificable(fase: Fase): void {
    const estado = fase.torneo?.estado;
    if (estado === 'FINALIZADO' || estado === 'CANCELADO') {
      throw new ConflictException(
        `No se pueden modificar los grupos de un torneo ${estado}`,
      );
    }
  }

  async validarNombreUnico(
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
