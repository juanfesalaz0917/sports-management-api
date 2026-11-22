import { Injectable } from '@nestjs/common';
import { CreateTorneoDto } from '../dto/create-torneo.dto';
import { TorneoResponseDto } from '../dto/torneo-response.dto';
import { Torneo } from '../entities/torneo.entity';

const dia = (f?: string | null): string | undefined =>
  f ? f.slice(0, 10) : undefined;

@Injectable()
export class TorneoMapper {
  toEntity(dto: CreateTorneoDto): Torneo {
    const t = new Torneo();
    t.nombre = dto.nombre.trim();
    t.fechaInicio = dia(dto.fechaInicio);
    t.fechaFin = dia(dto.fechaFin);
    t.fechaCierreInscripciones = dia(dto.fechaCierreInscripciones) ?? null;
    t.deporteId = dto.deporteId;
    t.estado = 'INSCRIPCIONES_ABIERTAS';
    t.activo = true;
    return t;
  }

  toResponseDto(entity: Torneo): TorneoResponseDto {
    return {
      id: Number(entity.id),
      nombre: entity.nombre,
      fechaInicio: entity.fechaInicio ?? undefined,
      fechaFin: entity.fechaFin ?? undefined,
      fechaCierreInscripciones: entity.fechaCierreInscripciones ?? null,
      estado: entity.estado,
      deporteId: Number(entity.deporteId),
      deporteNombre: entity.deporte?.nombre,
      activo: !!entity.activo,
    };
  }

  toResponseDtoList(entities: Torneo[]): TorneoResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
