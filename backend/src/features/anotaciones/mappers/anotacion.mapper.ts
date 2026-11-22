import { Injectable } from '@nestjs/common';
import { CreateAnotacionDto } from '../dto/create-anotacion.dto';
import { AnotacionResponseDto } from '../dto/anotacion-response.dto';
import { Anotacion } from '../entities/anotacion.entity';

@Injectable()
export class AnotacionMapper {
  toEntity(partidoId: number, dto: CreateAnotacionDto): Anotacion {
    const a = new Anotacion();
    a.partidoId = partidoId;
    a.jugadorId = dto.jugadorId;
    a.minuto = dto.minuto;
    a.descripcion = dto.descripcion;
    return a;
  }

  toResponseDto(entity: Anotacion): AnotacionResponseDto {
    return {
      id: entity.id,
      partidoId: Number(entity.partidoId),
      jugadorId: Number(entity.jugadorId),
      jugadorNombre: entity.jugador?.nombre,
      minuto: entity.minuto,
      tipo: 'GOL',
      descripcion: entity.descripcion,
    };
  }

  toResponseDtoList(entities: Anotacion[]): AnotacionResponseDto[] {
    return entities.map((a) => this.toResponseDto(a));
  }
}
