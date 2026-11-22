import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Fase } from '../fases/entities/fase.entity';
import { FaseFinal } from '../fases-finales/entities/fase-final.entity';
import { GrupoEquipo } from '../grupos/entities/grupo-equipo.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import {
  EstructuraFaseDto,
  EstructuraTorneoDto,
} from './dto/torneo-response.dto';
import { Torneo } from './entities/torneo.entity';

@Injectable()
export class TorneoEstructuraService {
  constructor(
    @InjectRepository(Torneo)
    private readonly repo: Repository<Torneo>,
    @InjectRepository(Fase)
    private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,
    @InjectRepository(GrupoEquipo)
    private readonly grupoEquipoRepo: Repository<GrupoEquipo>,
    @InjectRepository(FaseFinal)
    private readonly faseFinalRepo: Repository<FaseFinal>,
  ) {}

  async obtenerEstructura(id: number): Promise<EstructuraTorneoDto> {
    const torneo = await this.repo.findOne({ where: { id } });
    if (!torneo) throw new NotFoundException(`Torneo ${id} no encontrado`);

    const fases = await this.faseRepo.find({
      where: { torneoId: id },
      order: { orden: 'ASC', id: 'ASC' },
    });
    const faseIds = fases.map((f) => Number(f.id));

    const [grupos, finales] = faseIds.length
      ? await Promise.all([
          this.grupoRepo.find({ where: { faseId: In(faseIds) }, order: { id: 'ASC' } }),
          this.faseFinalRepo.find({ where: { faseId: In(faseIds) } }),
        ])
      : [[], []];

    const grupoIds = grupos.map((g) => Number(g.id));
    const miembros = grupoIds.length
      ? await this.grupoEquipoRepo.find({
          where: { grupoId: In(grupoIds) },
          relations: { equipo: true },
        })
      : [];

    const fasesDto: EstructuraFaseDto[] = fases.map((f) => {
      const dto: EstructuraFaseDto = {
        faseId: Number(f.id),
        nombre: f.nombre,
        tipo: f.tipo,
        orden: f.orden,
      };
      if (f.tipo === 'GRUPO') {
        dto.grupos = grupos
          .filter((g) => Number(g.faseId) === Number(f.id))
          .map((g) => ({
            grupoId: Number(g.id),
            nombreGrupo: g.nombreGrupo,
            equipos: miembros
              .filter((m) => Number(m.grupoId) === Number(g.id))
              .map((m) => ({
                equipoId: Number(m.equipoId),
                equipoNombre: m.equipo?.nombre,
              })),
          }));
      } else {
        dto.modalidad = finales.find((x) => Number(x.faseId) === Number(f.id))?.modalidad ?? null;
      }
      return dto;
    });

    return {
      torneoId: Number(torneo.id),
      torneoNombre: torneo.nombre,
      estado: torneo.estado,
      fases: fasesDto,
    };
  }
}
