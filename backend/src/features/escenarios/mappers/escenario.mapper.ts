import { Injectable } from '@nestjs/common';
import { CreateEscenarioDto } from '../dto/create-escenario.dto';
import { EscenarioResponseDto } from '../dto/escenario-response.dto';
import { Escenario } from '../entities/escenario.entity';

@Injectable()
export class EscenarioMapper {
  toEntity(dto: CreateEscenarioDto): Escenario {
    const e = new Escenario();
    e.nombre = dto.nombre.trim();
    e.direccion = dto.direccion?.trim();
    e.escenarioPadreId = dto.escenarioPadreId ?? null;
    e.activo = true;
    return e;
  }

  toResponseDto(entity: Escenario): EscenarioResponseDto {
    return {
      id: Number(entity.id),
      nombre: entity.nombre,
      direccion: entity.direccion ?? undefined,
      escenarioPadreId:
        entity.escenarioPadreId == null
          ? null
          : Number(entity.escenarioPadreId),
      escenarioPadreNombre: entity.escenarioPadre?.nombre,
      activo: !!entity.activo,
    };
  }

  toResponseDtoList(entities: Escenario[]): EscenarioResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
