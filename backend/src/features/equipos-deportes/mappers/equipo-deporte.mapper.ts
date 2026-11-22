import { Injectable } from '@nestjs/common';
import { EquipoDeporteResponseDto } from '../dto/equipo-deporte-response.dto';
import { EquipoDeporte } from '../entities/equipo-deporte.entity';

@Injectable()
export class EquipoDeporteMapper {
  toResponseDto(entity: EquipoDeporte): EquipoDeporteResponseDto {
    return {
      equipoId: Number(entity.equipoId),
      equipoNombre: entity.equipo?.nombre,
      deporteId: Number(entity.deporteId),
      deporteNombre: entity.deporte?.nombre,
    };
  }

  toResponseDtoList(entities: EquipoDeporte[]): EquipoDeporteResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
