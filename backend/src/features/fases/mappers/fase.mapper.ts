import { Injectable } from '@nestjs/common';
import { CreateFaseDto } from '../dto/create-fase.dto';
import { FaseResponseDto } from '../dto/fase-response.dto';
import { Fase } from '../entities/fase.entity';

/** Normaliza el alias GRUPOS al valor de BD (GRUPO). */
export function normalizarTipo(tipo: string): 'GRUPO' | 'FINAL' {
  return tipo === 'FINAL' ? 'FINAL' : 'GRUPO';
}

@Injectable()
export class FaseMapper {
  toEntity(torneoId: number, orden: number, dto: CreateFaseDto): Fase {
    const f = new Fase();
    f.nombre = dto.nombre.trim();
    f.tipo = normalizarTipo(dto.tipo);
    f.orden = orden;
    f.torneoId = torneoId;
    return f;
  }

  toResponseDto(entity: Fase): FaseResponseDto {
    return {
      id: Number(entity.id),
      nombre: entity.nombre ?? undefined,
      tipo: entity.tipo,
      orden: entity.orden,
      torneoId: Number(entity.torneoId),
      torneoNombre: entity.torneo?.nombre,
    };
  }

  toResponseDtoList(entities: Fase[]): FaseResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
