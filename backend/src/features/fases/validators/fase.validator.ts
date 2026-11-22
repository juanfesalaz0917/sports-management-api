import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaseFinal } from '../../fases-finales/entities/fase-final.entity';
import { Grupo } from '../../grupos/entities/grupo.entity';
import { Partido } from '../../partidos/entities/partido.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';
import { Fase } from '../entities/fase.entity';

@Injectable()
export class FaseValidator {
  constructor(
    @InjectRepository(Fase) private readonly repo: Repository<Fase>,
    @InjectRepository(Torneo) private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(Grupo) private readonly grupoRepo: Repository<Grupo>,
    @InjectRepository(FaseFinal) private readonly faseFinalRepo: Repository<FaseFinal>,
    @InjectRepository(Partido) private readonly partidoRepo: Repository<Partido>,
  ) {}

  async buscarTorneo(id: number): Promise<Torneo> {
    const torneo = await this.torneoRepo.findOne({ where: { id } });
    if (!torneo) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return torneo;
  }

  validarTorneoModificable(torneo: Torneo): void {
    if (torneo.estado === 'FINALIZADO' || torneo.estado === 'CANCELADO') {
      throw new ConflictException(`No se pueden modificar las fases de un torneo ${torneo.estado}`);
    }
  }

  async siguienteOrden(torneoId: number): Promise<number> {
    const ultima = await this.repo.findOne({ where: { torneoId }, order: { orden: 'DESC' } });
    return ultima ? ultima.orden + 1 : 1;
  }

  async validarOrdenUnico(torneoId: number, orden: number, excluirId?: number): Promise<void> {
    const existentes = await this.repo.find({ where: { torneoId, orden } });
    if (existentes.some((f) => Number(f.id) !== excluirId)) {
      throw new ConflictException(`El torneo ${torneoId} ya tiene una fase con orden ${orden}`);
    }
  }

  async contarAsociaciones(faseId: number): Promise<string[]> {
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
