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

  async consultarTabla(torneoId: number) {
    const partidos = await this.partidoRepo.find({
      where: { torneoId },
      relations: { equipos: { equipo: true } },
    });

    const tablaMap = new Map<number, { equipoId: number; nombre: string; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number; dg: number; puntos: number }>();

    for (const p of partidos) {
      for (const pe of p.equipos || []) {
        if (!tablaMap.has(pe.equipoId)) {
          tablaMap.set(pe.equipoId, {
            equipoId: pe.equipoId,
            nombre: pe.equipo?.nombre || `Equipo ${pe.equipoId}`,
            pj: 0,
            pg: 0,
            pe: 0,
            pp: 0,
            gf: 0,
            gc: 0,
            dg: 0,
            puntos: 0,
          });
        }
      }
    }

    // Calcular estadísticas según partidos finalizados
    for (const p of partidos.filter((part) => part.estado === 'FINALIZADO')) {
      const local = p.equipos?.find((e) => e.rol === 'LOCAL');
      const visitante = p.equipos?.find((e) => e.rol === 'VISITANTE');
      if (local && visitante) {
        const statsLoc = tablaMap.get(local.equipoId);
        const statsVis = tablaMap.get(visitante.equipoId);
        if (statsLoc && statsVis) {
          statsLoc.pj += 1;
          statsVis.pj += 1;
          // Simulación de marcador o anotaciones
          statsLoc.pg += 1;
          statsLoc.puntos += 3;
          statsVis.pp += 1;
        }
      }
    }

    return Array.from(tablaMap.values()).sort((a, b) => b.puntos - a.puntos || b.dg - a.dg);
  }
}
