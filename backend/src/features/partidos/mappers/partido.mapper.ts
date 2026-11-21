import { Injectable } from '@nestjs/common';
import { CreatePartidoDto } from '../dto/create-partido.dto';
import { PartidoResponseDto } from '../dto/partido-response.dto';
import { Partido } from '../entities/partido.entity';

@Injectable()
export class PartidoMapper {
  toEntity(dto: CreatePartidoDto): Partido {
    const p = new Partido();
    p.fechaHora = new Date(dto.fechaHora);
    p.torneoId = dto.torneoId;
    p.faseId = dto.faseId;
    p.escenarioId = dto.escenarioId;
    p.pelotaId = dto.pelotaId;
    p.estado = dto.estado || 'PROGRAMADO';
    return p;
  }

  toResponseDto(entity: Partido): PartidoResponseDto {
    const local = entity.equipos?.find((e) => e.rol === 'LOCAL');
    const visitante = entity.equipos?.find((e) => e.rol === 'VISITANTE');
    return {
      id: entity.id,
      fechaHora: entity.fechaHora,
      estado: entity.estado,
      torneoId: Number(entity.torneoId),
      torneoNombre: entity.torneo?.nombre,
      faseId: entity.faseId ? Number(entity.faseId) : undefined,
      faseNombre: entity.fase?.nombre,
      escenarioId: Number(entity.escenarioId),
      escenarioNombre: entity.escenario?.nombre,
      equipoLocalId: local ? Number(local.equipoId) : undefined,
      equipoLocalNombre: local?.equipo?.nombre,
      equipoVisitanteId: visitante ? Number(visitante.equipoId) : undefined,
      equipoVisitanteNombre: visitante?.equipo?.nombre,
      pelotaId: entity.pelotaId ? Number(entity.pelotaId) : undefined,
    };
  }

  toResponseDtoList(entities: Partido[]): PartidoResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
