import { Injectable } from '@nestjs/common';
import { CreateLocalidadDto } from '../dto/create-localidad.dto';
import { LocalidadResponseDto } from '../dto/localidad-response.dto';
import { Localidad } from '../entities/localidad.entity';

@Injectable()
export class LocalidadMapper {
  toEntity(dto: CreateLocalidadDto): Localidad {
    const l = new Localidad();
    l.nombre = dto.nombre;
    l.capacidad = dto.capacidad;
    l.escenarioId = dto.escenarioId;
    return l;
  }

  toResponseDto(entity: Localidad): LocalidadResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      capacidad: entity.capacidad,
      escenarioId: Number(entity.escenarioId),
      escenarioNombre: entity.escenario?.nombre,
    };
  }

  toResponseDtoList(entities: Localidad[]): LocalidadResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
