import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartidoDto } from '../dto/create-partido.dto';
import { Torneo } from '../../torneos/entities/torneo.entity';
import { Fase } from '../../fases/entities/fase.entity';
import { Escenario } from '../../escenarios/entities/escenario.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Pelota } from '../../pelotas/entities/pelota.entity';

@Injectable()
export class PartidoValidator {
  constructor(
    @InjectRepository(Torneo) private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(Fase) private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Escenario) private readonly escenarioRepo: Repository<Escenario>,
    @InjectRepository(Equipo) private readonly equipoRepo: Repository<Equipo>,
    @InjectRepository(Pelota) private readonly pelotaRepo: Repository<Pelota>,
  ) {}

  async validarReferencias(dto: CreatePartidoDto): Promise<void> {
    if (!(await this.torneoRepo.exists({ where: { id: dto.torneoId } }))) {
      throw new NotFoundException(`Torneo ${dto.torneoId} no existe`);
    }
    if (dto.faseId && !(await this.faseRepo.exists({ where: { id: dto.faseId } }))) {
      throw new NotFoundException(`Fase ${dto.faseId} no existe`);
    }
    if (!(await this.escenarioRepo.exists({ where: { id: dto.escenarioId } }))) {
      throw new NotFoundException(`Escenario ${dto.escenarioId} no existe`);
    }
    if (!(await this.equipoRepo.exists({ where: { id: dto.equipoLocalId } }))) {
      throw new NotFoundException(`Equipo local ${dto.equipoLocalId} no existe`);
    }
    if (!(await this.equipoRepo.exists({ where: { id: dto.equipoVisitanteId } }))) {
      throw new NotFoundException(`Equipo visitante ${dto.equipoVisitanteId} no existe`);
    }
    if (dto.pelotaId && !(await this.pelotaRepo.exists({ where: { id: dto.pelotaId } }))) {
      throw new NotFoundException(`Pelota ${dto.pelotaId} no existe`);
    }
  }
}
