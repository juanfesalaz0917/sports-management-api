import { Injectable } from '@nestjs/common';
import { CreateAficionadoDto } from '../dto/create-aficionado.dto';
import { AficionadoResponseDto } from '../dto/aficionado-response.dto';
import { UpdateAficionadoDto } from '../dto/update-aficionado.dto';
import { Aficionado } from '../entities/aficionado.entity';

@Injectable()
export class AficionadoMapper {
  toEntity(dto: CreateAficionadoDto): Aficionado {
    const a = new Aficionado();
    a.usuarioId = dto.usuarioId;
    a.nombre = dto.nombre;
    a.apellido = dto.apellido;
    a.telefono = dto.telefono;
    a.fechaRegistro = new Date();
    return a;
  }

  mergeEntity(entity: Aficionado, dto: UpdateAficionadoDto): Aficionado {
    if (dto.nombre !== undefined) entity.nombre = dto.nombre;
    if (dto.apellido !== undefined) entity.apellido = dto.apellido;
    if (dto.telefono !== undefined) entity.telefono = dto.telefono;
    return entity;
  }

  toResponseDto(entity: Aficionado): AficionadoResponseDto {
    return {
      id: entity.id,
      usuarioId: Number(entity.usuarioId),
      nombre: entity.nombre,
      apellido: entity.apellido,
      telefono: entity.telefono,
      fechaRegistro: entity.fechaRegistro,
    };
  }

  toResponseDtoList(entities: Aficionado[]): AficionadoResponseDto[] {
    return entities.map((a) => this.toResponseDto(a));
  }
}
