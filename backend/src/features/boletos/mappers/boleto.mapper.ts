import { Injectable } from '@nestjs/common';
import { CreateBoletoDto } from '../dto/create-boleto.dto';
import { BoletoResponseDto } from '../dto/boleto-response.dto';
import { Boleto } from '../entities/boleto.entity';

@Injectable()
export class BoletoMapper {
  toEntity(dto: CreateBoletoDto): Boleto {
    const b = new Boleto();
    b.codigo = dto.codigo;
    b.precio = dto.precio;
    b.partidoId = dto.partidoId;
    b.localidadId = dto.localidadId;
    b.aficionadoId = dto.aficionadoId;
    b.estado = dto.estado || 'DISPONIBLE';
    return b;
  }

  toResponseDto(entity: Boleto): BoletoResponseDto {
    return {
      id: entity.id,
      codigo: entity.codigo,
      precio: Number(entity.precio),
      estado: entity.estado,
      partidoId: Number(entity.partidoId),
      localidadId: Number(entity.localidadId),
      localidadNombre: entity.localidad?.nombre,
      aficionadoId: entity.aficionadoId ? Number(entity.aficionadoId) : undefined,
      aficionadoNombre: entity.aficionado?.nombre,
    };
  }

  toResponseDtoList(entities: Boleto[]): BoletoResponseDto[] {
    return entities.map((b) => this.toResponseDto(b));
  }
}
