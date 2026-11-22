import { MetodoPagoResponseDto } from '../dto/metodo-pago-response.dto';
import { MetodoPago } from '../entities/metodo-pago.entity';

export class MetodoPagoMapper {
  static toResponse(entity: MetodoPago): MetodoPagoResponseDto {
    return {
      id: Number(entity.id),
      nombre: entity.nombre,
      descripcion: entity.descripcion ?? undefined,
    };
  }

  static toResponseList(entities: MetodoPago[]): MetodoPagoResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }
}
