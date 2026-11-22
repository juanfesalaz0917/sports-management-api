import { Injectable } from '@nestjs/common';
import { InscripcionResponseDto } from '../dto/inscripcion-response.dto';
import { Inscripcion } from '../entities/inscripcion.entity';

@Injectable()
export class InscripcionMapper {
  toResponseDto(entity: Inscripcion): InscripcionResponseDto {
    return {
      id: Number(entity.id),
      torneoId: Number(entity.torneoId),
      torneoNombre: entity.torneo?.nombre,
      equipoId: Number(entity.equipoId),
      equipoNombre: entity.equipo?.nombre,
      fechaInscripcion: entity.fechaInscripcion ?? undefined,
      estado: entity.estado ?? undefined,
    };
  }

  toResponseDtoList(entities: Inscripcion[]): InscripcionResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
