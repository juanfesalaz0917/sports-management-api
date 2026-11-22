import { Injectable } from '@nestjs/common';
import { CreatePelotaDto } from '../dto/create-pelota.dto';
import { PelotaResponseDto } from '../dto/pelota-response.dto';
import { UpdatePelotaDto } from '../dto/update-pelota.dto';
import { Pelota } from '../entities/pelota.entity';

@Injectable()
export class PelotaMapper {
  toEntity(dto: CreatePelotaDto): Pelota {
    const entity = new Pelota();
    entity.referencia = dto.referencia;
    entity.marca = dto.marca;
    return entity;
  }

  mergeEntity(entity: Pelota, dto: UpdatePelotaDto): Pelota {
    if (dto.referencia !== undefined) entity.referencia = dto.referencia;
    if (dto.marca !== undefined) entity.marca = dto.marca;
    return entity;
  }

  toResponseDto(entity: Pelota): PelotaResponseDto {
    return {
      id: entity.id,
      referencia: entity.referencia,
      marca: entity.marca,
    };
  }

  toResponseDtoList(entities: Pelota[]): PelotaResponseDto[] {
    return entities.map((p) => this.toResponseDto(p));
  }
}
