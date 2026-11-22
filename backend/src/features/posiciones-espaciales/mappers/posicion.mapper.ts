import { Injectable } from '@nestjs/common';
import { CreatePosicionEspacialDto } from '../dto/create-posicion.dto';
import { PosicionEspacialResponseDto } from '../dto/posicion-response.dto';
import { PosicionEspacial } from '../entities/posicion-espacial.entity';

@Injectable()
export class PosicionMapper {
  toEntity(dto: CreatePosicionEspacialDto): PosicionEspacial {
    const p = new PosicionEspacial();
    p.nombre = dto.nombre;
    p.descripcion = dto.descripcion;
    return p;
  }

  toResponseDto(entity: PosicionEspacial): PosicionEspacialResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
    };
  }

  toResponseDtoList(entities: PosicionEspacial[]): PosicionEspacialResponseDto[] {
    return entities.map((p) => this.toResponseDto(p));
  }
}
