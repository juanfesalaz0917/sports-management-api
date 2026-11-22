import { Injectable } from '@nestjs/common';
import { CreateDeporteDto } from '../dto/create-deporte.dto';
import { DeporteResponseDto } from '../dto/deporte-response.dto';
import { Deporte } from '../entities/deporte.entity';

@Injectable()
export class DeporteMapper {
  toEntity(dto: CreateDeporteDto): Deporte {
    const d = new Deporte();
    d.nombre = dto.nombre.trim();
    d.descripcion = dto.descripcion;
    d.deportePadreId = dto.deportePadreId ?? null;
    d.activo = true;
    return d;
  }

  toResponseDto(entity: Deporte): DeporteResponseDto {
    return {
      id: Number(entity.id),
      nombre: entity.nombre,
      descripcion: entity.descripcion ?? undefined,
      deportePadreId:
        entity.deportePadreId == null ? null : Number(entity.deportePadreId),
      deportePadreNombre: entity.deportePadre?.nombre,
      activo: !!entity.activo,
    };
  }

  toResponseDtoList(entities: Deporte[]): DeporteResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
