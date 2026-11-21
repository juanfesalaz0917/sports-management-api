import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesarrolloTorneoResponseDto } from './dto/desarrollo-torneo-response.dto';
import { Torneo } from '../stubs/entities/torneo.entity';
import { Fase } from '../stubs/entities/fase.entity';
import { Partido } from '../partidos/entities/partido.entity';

@Injectable()
export class TorneosDesarrolloService {
  constructor(
    @InjectRepository(Torneo) private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(Fase) private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Partido) private readonly partidoRepo: Repository<Partido>,
  ) {}

  async consultarDesarrollo(torneoId: number): Promise<DesarrolloTorneoResponseDto> {
    const torneo = await this.torneoRepo.findOne({ where: { id: torneoId } });
    if (!torneo) throw new NotFoundException(`Torneo ${torneoId} no encontrado`);

    const fases = await this.faseRepo.find({ where: { torneoId } });
    const fasesDto = [];

    for (const f of fases) {
      const partidos = await this.partidoRepo.find({
        where: { faseId: f.id },
        relations: { equipos: { equipo: true } },
      });

      const conResultado = partidos.filter((p) => p.estado === 'FINALIZADO');
      const pendientes = partidos.filter((p) => p.estado !== 'FINALIZADO');

      fasesDto.push({
        faseId: f.id,
        nombre: f.nombre || `Fase ${f.id}`,
        tipo: f.tipo,
        orden: 1,
        partidosConResultado: conResultado,
        partidosPendientes: pendientes,
      });
    }

    return {
      torneoId: torneo.id,
      nombre: torneo.nombre,
      estado: 'ACTIVO',
      fases: fasesDto,
    };
  }
}
