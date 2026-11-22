import { Injectable } from '@nestjs/common';
import { CreateEquipoDto } from '../dto/create-equipo.dto';
import { EquipoResponseDto } from '../dto/equipo-response.dto';
import { Equipo } from '../entities/equipo.entity';

@Injectable()
export class EquipoMapper {
  toEntity(dto: CreateEquipoDto): Equipo {
    const e = new Equipo();
    e.nombre = dto.nombre.trim();
    e.genero = dto.genero ?? null;
    e.fechaCreacion = dto.fechaCreacion;
    e.activo = true;
    return e;
  }

  toResponseDto(entity: Equipo): EquipoResponseDto {
    return {
      id: Number(entity.id),
      nombre: entity.nombre,
      genero: entity.genero ?? null,
      fechaCreacion: entity.fechaCreacion ?? undefined,
      activo: !!entity.activo,
    };
  }

  toResponseDtoList(entities: Equipo[]): EquipoResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
