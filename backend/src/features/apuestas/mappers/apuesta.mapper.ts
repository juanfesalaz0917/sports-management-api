import { Injectable } from '@nestjs/common';
import { CreateApuestaDto } from '../dto/create-apuesta.dto';
import { ApuestaResponseDto } from '../dto/apuesta-response.dto';
import { Apuesta } from '../entities/apuesta.entity';

@Injectable()
export class ApuestaMapper {
  toEntity(dto: CreateApuestaDto): Apuesta {
    const a = new Apuesta();
    a.aficionadoId = dto.aficionadoId;
    a.partidoId = dto.partidoId;
    a.metodoAficionadoId = dto.metodoAficionadoId;
    a.equipoId = dto.equipoId;
    a.monto = dto.monto;
    a.fechaHora = new Date();
    a.estado = dto.estado || 'REGISTRADA';
    return a;
  }

  toResponseDto(entity: Apuesta): ApuestaResponseDto {
    return {
      id: entity.id,
      monto: Number(entity.monto),
      fechaHora: entity.fechaHora,
      estado: entity.estado,
      aficionadoId: Number(entity.aficionadoId),
      aficionadoNombre: entity.aficionado?.nombre,
      partidoId: Number(entity.partidoId),
      metodoAficionadoId: Number(entity.metodoAficionadoId),
      equipoId: entity.equipoId ? Number(entity.equipoId) : undefined,
    };
  }

  toResponseDtoList(entities: Apuesta[]): ApuestaResponseDto[] {
    return entities.map((a) => this.toResponseDto(a));
  }
}
