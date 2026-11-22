import { HabilidadResponseDto } from '../dto/habilidad-response.dto';
import { Habilidad } from '../entities/habilidad.entity';

export class HabilidadMapper {
  static toResponse(entity: Habilidad): HabilidadResponseDto {
    return {
      id: Number(entity.id),
      nombre: entity.nombre,
      descripcion: entity.descripcion ?? undefined,
    };
  }

  static toResponseList(entities: Habilidad[]): HabilidadResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }
}
