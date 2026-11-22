import { Injectable } from '@nestjs/common';
import { CreateJugadorDto } from '../dto/create-jugador.dto';
import { JugadorResponseDto } from '../dto/jugador-response.dto';
import { Jugador } from '../entities/jugador.entity';

@Injectable()
export class JugadorMapper {
  toEntity(dto: CreateJugadorDto): Jugador {
    const j = new Jugador();
    j.nombre = dto.nombre.trim();
    j.apellido = dto.apellido?.trim();
    j.documento = dto.documento.trim();
    j.fechaNacimiento = dto.fechaNacimiento;
    j.posicionId = dto.posicionId;
    j.activo = true;
    return j;
  }

  toResponseDto(entity: Jugador, posicionNombre?: string): JugadorResponseDto {
    return {
      id: Number(entity.id),
      nombre: entity.nombre,
      apellido: entity.apellido ?? undefined,
      documento: entity.documento ?? null,
      fechaNacimiento: entity.fechaNacimiento ?? undefined,
      posicionId: entity.posicionId == null ? null : Number(entity.posicionId),
      posicionNombre,
      activo: !!entity.activo,
    };
  }
}
